import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/utils/db'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'your_jwt_secret_key' // Заміни на надійний секрет у .env

export async function POST(req: NextRequest) {
  await connectDB()
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ message: 'Всі поля обовʼязкові' }, { status: 400 })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return NextResponse.json({ message: 'Користувача не знайдено' }, { status: 404 })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return NextResponse.json({ message: 'Невірний пароль' }, { status: 401 })
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  return NextResponse.json({ token, user: { email: user.email, name: user.name, role: user.role } })
} 