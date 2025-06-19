"use client"
import { useEffect, useState } from 'react'
import { categories } from '@/utils/categories'
import { TrashIcon, TagIcon, Squares2X2Icon } from '@heroicons/react/24/outline'

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([])
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = () => {
    setLoading(true)
    let url = '/api/admin/products/list'
    const params = []
    if (category) params.push(`category=${category}`)
    if (subcategory) params.push(`subcategory=${subcategory}`)
    if (params.length) url += '?' + params.join('&')
    const token = localStorage.getItem('token')
    fetch(url, { headers: { Authorization: `Bearer ${token || ''}` } })
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line
  }, [category, subcategory])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Ви дійсно хочете видалити цей товар?')) return
    setDeleting(id)
    const token = localStorage.getItem('token')
    await fetch(`/api/admin/products/delete?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token || ''}` },
    })
    setDeleting(null)
    fetchProducts()
  }

  const subcategories = categories.find(c => c.value === category)?.subcategories || []

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 mb-10 overflow-x-auto border border-primary-100">
      <h2 className="text-2xl font-bold mb-4 text-primary-700 text-center flex items-center gap-2"><Squares2X2Icon className="w-7 h-7 text-primary-400" />Товари</h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 mt-2 w-full max-w-lg mx-auto">
        <select
          className="input-primary text-base h-12 w-full min-w-[220px] max-w-[320px] text-center"
          value={category}
          onChange={e => { setCategory(e.target.value); setSubcategory('') }}
        >
          <option value="">Всі категорії</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.name}</option>
          ))}
        </select>
        <select
          className="input-primary text-base h-12 w-full min-w-[220px] max-w-[320px] text-center"
          value={subcategory}
          onChange={e => setSubcategory(e.target.value)}
          disabled={!category}
        >
          <option value="">Всі підкатегорії</option>
          {subcategories.map(sub => (
            <option key={sub.value} value={sub.value}>{sub.name}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center text-lg py-10">Завантаження...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Товарів не знайдено</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-left rounded-lg overflow-hidden bg-gray-50 min-w-[700px]">
            <thead>
              <tr className="bg-primary-100 text-primary-800">
                <th className="p-3 font-bold">Назва</th>
                <th className="p-3 font-bold">Категорія</th>
                <th className="p-3 font-bold">Підкатегорія</th>
                <th className="p-3 font-bold">Ціна</th>
                <th className="p-3 font-bold">Дата</th>
                <th className="p-3 font-bold">Дія</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-t hover:bg-primary-50 transition-colors">
                  <td className="p-3 font-medium max-w-[180px] truncate flex items-center gap-2"><TagIcon className="w-5 h-5 text-primary-400" />{product.name}</td>
                  <td className="p-3">{categories.find(c => c.value === product.category)?.name || product.category}</td>
                  <td className="p-3">{subcategories.find(s => s.value === product.subcategory)?.name || product.subcategory}</td>
                  <td className="p-3">{product.price} грн</td>
                  <td className="p-3">{new Date(product.createdAt).toLocaleString('uk-UA')}</td>
                  <td className="p-3">
                    <button
                      className="btn-accent px-4 py-1 text-sm flex items-center gap-1 hover:bg-red-100 hover:text-red-600 transition-colors"
                      onClick={() => handleDelete(product._id)}
                      disabled={deleting === product._id}
                    >
                      <TrashIcon className="w-5 h-5" /> {deleting === product._id ? 'Видаляю...' : 'Видалити'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 