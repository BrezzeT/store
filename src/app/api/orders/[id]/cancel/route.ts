import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import { getUserFromToken } from '@/utils/auth';
import Order from '@/models/Order';
import { User } from '@/models/User';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.replace('Bearer ', '');
  const session = getUserFromToken(token);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const { reason } = await req.json();
  if (!reason) {
    return NextResponse.json({ error: 'Cancellation reason is required' }, { status: 400 });
  }
  const order = await Order.findById(id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (order.user.toString() !== session.userId) {
    return NextResponse.json({ error: 'Not authorized to cancel this order' }, { status: 403 });
  }
  if (order.usedBonus && order.usedBonus > 0) {
    const user = await User.findById(order.user);
    if (user) {
      user.bonusPoints = (user.bonusPoints || 0) + order.usedBonus;
      await user.save();
    }
  }
  order.status = 'cancelled';
  order.cancellationReason = reason;
  await order.save();
  return NextResponse.json({ message: 'Order cancelled successfully', order });
} 