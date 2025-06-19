import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/utils/auth'
import { connectDB } from '@/utils/db'
import { Product } from '@/models/Product'
import path from 'path'
import fs from 'fs/promises'

export async function DELETE(req: NextRequest) {
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
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ message: 'Не вказано id товару' }, { status: 400 })
  const product = await Product.findById(id)
  if (!product) return NextResponse.json({ message: 'Товар не знайдено' }, { status: 404 })
  // Видаляємо картинку
  if (product.image && product.image.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), 'public', product.image)
    try { await fs.unlink(filePath) } catch {}
  }
  await Product.deleteOne({ _id: id })
  return NextResponse.json({ message: 'Товар видалено' })
} 