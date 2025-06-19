import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/utils/auth'
import { connectDB } from '@/utils/db'
import { User } from '@/models/User'

export async function GET(req: NextRequest) {
  await connectDB()
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ message: 'Не авторизовано' }, { status: 401 })
  }
  const token = authHeader.replace('Bearer ', '')
  const userData = getUserFromToken(token)
  if (!userData || userData.role !== 'admin') {
    return NextResponse.json({ message: 'Доступ заборонено' }, { status: 403 })
  }
  // Наприклад, повертаємо список користувачів
  const users = await User.find().select('-password')
  return NextResponse.json({ users })
} 