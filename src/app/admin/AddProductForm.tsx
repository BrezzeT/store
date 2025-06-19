"use client"
import { useState } from 'react'
import { categories } from '@/utils/categories'
import { PlusCircleIcon, PhotoIcon, TagIcon, Squares2X2Icon, CurrencyDollarIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function AddProductForm({ onProductAdded }: { onProductAdded?: () => void }) {
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value)
    setSubcategory('')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    if (!category || !subcategory || !name || !description || !price || !image) {
      setError('Всі поля обовʼязкові')
      setLoading(false)
      return
    }
    const formData = new FormData()
    formData.append('category', category)
    formData.append('subcategory', subcategory)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('image', image)
    const token = localStorage.getItem('token')
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token || ''}` },
      body: formData,
    })
    const data = await res.json()
    if (res.ok) {
      setSuccess('Товар успішно додано!')
      setCategory('')
      setSubcategory('')
      setName('')
      setDescription('')
      setPrice('')
      setImage(null)
      if (onProductAdded) onProductAdded()
    } else {
      setError(data.message || 'Помилка додавання товару')
    }
    setLoading(false)
  }

  const subcategories = categories.find(c => c.value === category)?.subcategories || []

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 rounded-3xl shadow-2xl p-8 mb-8 w-full max-w-2xl mx-auto flex flex-col gap-8 animate-fade-in border border-primary-100 items-center">
      <h3 className="text-2xl font-bold mb-4 text-primary-700 text-center flex items-center gap-2"><PlusCircleIcon className="w-7 h-7 text-primary-400" />Додати товар</h3>
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
          <label className="font-semibold text-gray-700 text-base flex items-center gap-1"><Squares2X2Icon className="w-5 h-5 text-primary-400" />Категорія</label>
          <select className="input-primary text-lg h-12 w-full text-center" value={category} onChange={handleCategoryChange} required>
            <option value="">Оберіть категорію</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
          <label className="font-semibold text-gray-700 text-base flex items-center gap-1"><TagIcon className="w-5 h-5 text-primary-400" />Підкатегорія</label>
          <select className="input-primary text-lg h-12 w-full text-center" value={subcategory} onChange={e => setSubcategory(e.target.value)} required disabled={!category}>
            <option value="">Оберіть підкатегорію</option>
            {subcategories.map(sub => (
              <option key={sub.value} value={sub.value}>{sub.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
          <label className="font-semibold text-gray-700 text-base flex items-center gap-1"><DocumentTextIcon className="w-5 h-5 text-primary-400" />Назва товару</label>
          <input className="input-primary text-lg h-12 w-full text-center" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
          <label className="font-semibold text-gray-700 text-base flex items-center gap-1"><CurrencyDollarIcon className="w-5 h-5 text-primary-400" />Ціна (грн)</label>
          <input type="number" min="1" className="input-primary text-lg h-12 w-full text-center" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
          <label className="font-semibold text-gray-700 text-base flex items-center gap-1"><PhotoIcon className="w-5 h-5 text-primary-400" />Зображення</label>
          <input type="file" accept="image/*" className="input-primary text-lg h-12 w-full text-center" onChange={handleImageChange} required />
          {image && <span className="text-xs text-gray-500 mt-1">{image.name}</span>}
        </div>
        <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
          <label className="font-semibold text-gray-700 text-base flex items-center gap-1"><DocumentTextIcon className="w-5 h-5 text-primary-400" />Опис</label>
          <textarea className="input-primary text-lg min-h-[80px] w-full text-center" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
      </div>
      {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
      {success && <div className="text-green-600 text-center font-semibold">{success}</div>}
      <button type="submit" className="btn-primary text-lg mt-2 w-full sm:w-auto self-center px-10 py-3 flex items-center gap-2" disabled={loading}>
        <PlusCircleIcon className="w-6 h-6" />{loading ? 'Додаємо...' : 'Додати товар'}
      </button>
    </form>
  )
} 