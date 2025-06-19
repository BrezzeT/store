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
  if (!userData) {
    return NextResponse.json({ message: 'Недійсний токен' }, { status: 401 })
  }
  const user = await User.findById(userData.userId).select('-password')
  if (!user) {
    return NextResponse.json({ message: 'Користувача не знайдено' }, { status: 404 })
  }
  return NextResponse.json({ user })
}

export async function PATCH(req: NextRequest) {
  await connectDB()
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ message: 'Не авторизовано' }, { status: 401 })
  }
  const token = authHeader.replace('Bearer ', '')
  const userData = getUserFromToken(token)
  if (!userData) {
    return NextResponse.json({ message: 'Недійсний токен' }, { status: 401 })
  }
  const user = await User.findById(userData.userId)
  if (!user) {
    return NextResponse.json({ message: 'Користувача не знайдено' }, { status: 404 })
  }
  const { questId } = await req.json()
  if (!questId) {
    return NextResponse.json({ message: 'questId обовʼязковий' }, { status: 400 })
  }
  if (user.quests?.[questId]) {
    return NextResponse.json({ message: 'Квест вже виконано' }, { status: 400 })
  }
  user.quests = { ...user.quests, [questId]: true }
  user.bonusPoints = (user.bonusPoints || 0) + 50
  await user.save()
  return NextResponse.json({ success: true, bonusPoints: user.bonusPoints, quests: user.quests })
} 