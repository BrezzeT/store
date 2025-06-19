import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/utils/auth'
import { connectDB } from '@/utils/db'
import { Product } from '@/models/Product'

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
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const subcategory = searchParams.get('subcategory')
  const filter: any = {}
  if (category) filter.category = category
  if (subcategory) filter.subcategory = subcategory
  const products = await Product.find(filter).sort({ createdAt: -1 })
  return NextResponse.json({ products })
} 