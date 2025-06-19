import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/utils/db'
import { Product } from '@/models/Product'

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  if (!search) return NextResponse.json({ suggestions: [] })
  const products = await Product.find({ name: { $regex: search, $options: 'i' } }).limit(5)
  return NextResponse.json({ suggestions: products })
} 