import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/utils/db'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  await connectDB()
  const { email, password, name } = await req.json()

  if (!email || !password || !name) {
    return NextResponse.json({ message: 'Всі поля обовʼязкові' }, { status: 400 })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return NextResponse.json({ message: 'Користувач з таким email вже існує' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({
    email,
    password: hashedPassword,
    name,
    role: 'user',
  })
  await user.save()

  return NextResponse.json({ message: 'Реєстрація успішна' }, { status: 201 })
} 