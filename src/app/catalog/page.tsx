"use client"
import { useEffect, useState } from 'react'
import { categories } from '@/utils/categories'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCart } from '../cart/CartContext'
import Image from 'next/image'

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [loading, setLoading] = useState(true)
  const search = searchParams?.get('search') || ''
  const { addToCart } = useCart()
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  // Ініціалізація фільтрів з query-параметрів
  useEffect(() => {
    const cat = searchParams?.get('category') || ''
    const subcat = searchParams?.get('subcategory') || ''
    setCategory(cat)
    setSubcategory(subcat)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setLoading(true)
    let url = '/api/products'
    const params = []
    if (category) params.push(`category=${category}`)
    if (subcategory) params.push(`subcategory=${subcategory}`)
    if (search) params.push(`search=${encodeURIComponent(search)}`)
    if (minPrice) params.push(`minPrice=${minPrice}`)
    if (maxPrice) params.push(`maxPrice=${maxPrice}`)
    if (params.length) url += '?' + params.join('&')
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
  }, [category, subcategory, search, minPrice, maxPrice])

  // Підкатегорії тільки для вибраної категорії
  const subcategories = categories.find(c => c.value === category)?.subcategories || []

  // Оновлення query-параметрів при зміні фільтрів
  useEffect(() => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (subcategory) params.set('subcategory', subcategory)
    if (search) params.set('search', search)
    router.replace(`/catalog${params.toString() ? '?' + params.toString() : ''}`)
    // eslint-disable-next-line
  }, [category, subcategory, search])

  // Фільтрація на фронті (на випадок, якщо бекенд повертає зайве)
  const filteredProducts = products.filter(product => {
    if (category && product.category !== category) return false
    if (subcategory && product.subcategory !== subcategory) return false
    if (search && !product.name.toLowerCase().includes(search.toLowerCase()) && !product.description.toLowerCase().includes(search.toLowerCase())) return false
    if (minPrice && product.price < Number(minPrice)) return false
    if (maxPrice && product.price > Number(maxPrice)) return false
    return true
  })

  return (
    <div className="min-h-[70vh] bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold mb-8 text-primary-700 text-center">Каталог товарів</h1>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <select
            className="input-primary text-lg h-12 min-w-[180px]"
            value={category}
            onChange={e => { setCategory(e.target.value); setSubcategory('') }}
          >
            <option value="">Всі категорії</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.name}</option>
            ))}
          </select>
          <select
            className="input-primary text-lg h-12 min-w-[180px]"
            value={subcategory}
            onChange={e => setSubcategory(e.target.value)}
            disabled={!category}
          >
            <option value="">Всі підкатегорії</option>
            {subcategories.map(sub => (
              <option key={sub.value} value={sub.value}>{sub.name}</option>
            ))}
          </select>
          <input
            type="number"
            className="input-primary text-lg h-12 w-32"
            placeholder="Від, грн"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            min={0}
          />
          <input
            type="number"
            className="input-primary text-lg h-12 w-32"
            placeholder="До, грн"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            min={0}
          />
        </div>
        {loading ? (
          <div className="text-center text-lg py-20">Завантаження...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-20">Товарів не знайдено</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => {
              const cat = categories.find(c => c.value === product.category)
              const subcat = cat?.subcategories.find(s => s.value === product.subcategory)
              return (
                <div
                  key={product._id}
                  className="card flex flex-col gap-4 items-stretch animate-fade-in bg-white rounded-2xl shadow-soft hover:shadow-hover transition-all duration-200 ease-in-out transform hover:-translate-y-1 border border-gray-100 p-5 group relative overflow-hidden"
                >
                  <Link
                    href={`/product/${product._id}`}
                    className="block"
                  >
                    <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center relative mb-2 group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                        loading="lazy"
                      />
                      {product.salePrice && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-xl shadow">Акція</span>
                      )}
                    </div>
                    <div className="font-bold text-xl text-gray-900 truncate mb-1">{product.name}</div>
                    <div className="text-gray-600 text-base line-clamp-2 mb-2">{product.description}</div>
                    <div className="font-extrabold text-primary-700 text-2xl mt-auto mb-1">
                      {product.salePrice ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">{product.price} грн</span>
                          <span>{product.salePrice} грн</span>
                        </>
                      ) : (
                        <span>{product.price} грн</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {cat?.name} {subcat ? `/ ${subcat.name}` : ''}
                    </div>
                  </Link>
                  <button
                    className="btn-primary mt-2 w-full py-3 text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl transition-all duration-200"
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
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
} 