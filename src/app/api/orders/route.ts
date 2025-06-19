import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import { getUserFromToken } from '@/utils/auth';
import Order from '@/models/Order';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
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
  const user = await User.findOne({ email: session.email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  if (user.role !== 'admin') {
    const orders = await Order.find({ user: user._id }).sort({ date: -1 }).populate('items.product').populate('user');
    return NextResponse.json(orders);
  } else {
    const orders = await Order.find().sort({ date: -1 }).populate('items.product').populate('user');
    return NextResponse.json(orders);
  }
}

export async function POST(req: NextRequest) {
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
  const user = await User.findOne({ email: session.email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const body = await req.json();
  const { items, total, address, phone, comment, usedBonus } = body;
  const order = await Order.create({
    user: user._id,
    items,
    total,
    address,
    phone,
    comment
  });
  if (usedBonus && usedBonus > 0) {
    user.bonusPoints = Math.max(0, (user.bonusPoints || 0) - usedBonus);
    await user.save();
  }
  return NextResponse.json(order, { status: 201 });
} 