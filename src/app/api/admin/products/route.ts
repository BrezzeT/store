import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/utils/auth'
import { connectDB } from '@/utils/db'
import { Product } from '@/models/Product'
import path from 'path'
import fs from 'fs/promises'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
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

  // Парсимо multipart/form-data
  const formData = await req.formData()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = Number(formData.get('price'))
  const category = formData.get('category') as string
  const subcategory = formData.get('subcategory') as string
  const imageFile = formData.get('image') as File

  if (!name || !description || !price || !category || !subcategory || !imageFile) {
    return NextResponse.json({ message: 'Всі поля обовʼязкові' }, { status: 400 })
  }

  // Зберігаємо файл у /public/uploads
  const buffer = Buffer.from(await imageFile.arrayBuffer())
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadDir, { recursive: true })
  const fileName = Date.now() + '-' + imageFile.name.replace(/\s+/g, '_')
  const filePath = path.join(uploadDir, fileName)
  await fs.writeFile(filePath, buffer)
  const imageUrl = '/uploads/' + fileName

  const product = new Product({
    name,
    description,
    price,
    category,
    subcategory,
    image: imageUrl,
  })
  await product.save()

  return NextResponse.json({ message: 'Товар додано', product }, { status: 201 })
} 