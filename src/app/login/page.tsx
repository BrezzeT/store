"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token)
      // редірект залежно від ролі
      if (data.user.role === 'admin') router.push('/admin')
      else router.push('/account')
    } else {
      setError(data.message || 'Помилка входу')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-soft mt-10 mb-16 animate-fade-in border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-primary-700">Вхід</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Email</label>
            <input
              type="email"
              className="input-primary text-lg h-12"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Пароль</label>
            <input
              type="password"
              className="input-primary text-lg h-12"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <div className="text-red-500 text-center font-semibold border border-red-200 bg-red-50 rounded-xl py-2 px-4">{error}</div>}
          <div className="flex gap-4 mt-6">
            <button type="submit" className="btn-primary flex-1 text-lg" disabled={loading}>
              {loading ? 'Вхід...' : 'Увійти'}
            </button>
            <button
              type="button"
              className="btn-secondary flex-1 text-lg"
              onClick={() => router.push('/register')}
            >
              Зареєструватися
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 