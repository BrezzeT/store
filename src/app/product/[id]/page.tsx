"use client"
import { notFound } from 'next/navigation'
import { categories } from '@/utils/categories'
import { useCart } from '../../cart/CartContext'
import { useEffect, useState } from 'react'
import Image from 'next/image'

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products?id=${id}`, { cache: 'no-store' })
  const data = await res.json()
  if (!data.products || !data.products.length) return null
  return data.products[0]
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    getProduct(params.id).then(setProduct)
  }, [params.id])

  if (!product) return <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-10">Завантаження...</div>
  const category = categories.find(c => c.value === product.category)
  const subcategory = category?.subcategories.find(s => s.value === product.subcategory)

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-3xl p-8 bg-white rounded-2xl shadow-soft animate-fade-in flex flex-col md:flex-row gap-8 mb-16 border border-gray-100 group overflow-hidden">
        <div className="flex-1 flex items-center justify-center relative h-80 group-hover:scale-105 transition-transform duration-300">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <h1 className="text-3xl font-extrabold text-primary-700 mb-2">{product.name}</h1>
          <div className="text-gray-600 text-lg mb-2">{product.description}</div>
          <div className="flex gap-4 text-base text-gray-500">
            <span>Категорія: <b>{category?.name || product.category}</b></span>
            <span>Підкатегорія: <b>{subcategory?.name || product.subcategory}</b></span>
          </div>
          <div className="text-2xl font-bold text-primary-800 mt-4 mb-2">
            {product.salePrice ? (
              <>
                <span className="line-through text-gray-400 mr-2">{product.price} грн</span>
                <span>{product.salePrice} грн</span>
              </>
            ) : (
              <span>{product.price} грн</span>
            )}
          </div>
          <button
            className="btn-primary mt-6 w-full py-3 text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl transition-all duration-200"
            onClick={() => addToCart({
              _id: product._id,
              name: product.name,
              price: product.price,
              salePrice: product.salePrice,
              image: product.image,
              quantity: 1
            })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25A3.75 3.75 0 0011.25 18h1.5a3.75 3.75 0 003.75-3.75V6.75m-9 7.5V6.75m0 0L4.125 5.272A1.125 1.125 0 013.75 4.125V3m3.75 3.75h9.75m0 0l1.125 1.478c.13.492.576.835 1.087.835h1.386m-2.25-2.313V3m0 0h-1.5m1.5 0v1.125m0 0h-1.5m1.5 0v1.125" />
            </svg>
            Додати в корзину
          </button>
        </div>
      </div>
    </div>
  )
} 