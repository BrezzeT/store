import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/utils/db'
import { Product } from '@/models/Product'

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const subcategory = searchParams.get('subcategory')
  const id = searchParams.get('id')

  const filter: any = {}
  if (id) filter._id = id
  if (category) filter.category = category
  if (subcategory) filter.subcategory = subcategory

  const products = await Product.find(filter).sort({ createdAt: -1 })
  return NextResponse.json({ products })
} 