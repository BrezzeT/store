"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AddProductForm from './AddProductForm'
import ProductList from './ProductList'
import { UserGroupIcon, ArrowRightOnRectangleIcon, ClipboardDocumentListIcon, XCircleIcon } from '@heroicons/react/24/outline'

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }
    // Перевірка ролі через API
    fetch('/api/account/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.role === 'admin') {
          setIsAdmin(true)
        } else if (data.user && data.user.role !== 'admin') {
          setIsAdmin(false)
          router.replace('/account')
        } else {
          setIsAdmin(false)
          localStorage.removeItem('token')
          router.replace('/login')
        }
      })
    fetch('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users)
        else {
          setError(data.message || 'Помилка')
          if (data.message === 'Не авторизовано' || data.message === 'Доступ заборонено') {
            localStorage.removeItem('token')
            router.replace('/login')
          }
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Помилка при завантаженні даних')
        setLoading(false)
      })
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setOrdersLoading(false)
      })
      .catch(() => {
        setOrdersError('Не вдалося завантажити замовлення')
        setOrdersLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8 text-center">Завантаження...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!isAdmin) return null

  return (
    <div className="min-h-[70vh] flex flex-col items-center bg-gradient-to-br from-primary-50 to-accent-100 py-10">
      <div className="w-full max-w-6xl flex justify-end mb-4">
        <button
          className="btn-accent text-base px-6 py-2 flex items-center gap-2 shadow hover:scale-105 transition-transform"
          onClick={() => {
            localStorage.removeItem('token');
            router.replace('/login');
          }}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" /> Вийти
        </button>
      </div>
      <h1 className="text-4xl font-extrabold mb-8 text-primary-700 text-center flex items-center gap-3"><ClipboardDocumentListIcon className="w-10 h-10 text-primary-400" />Адмін-панель</h1>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 border border-primary-100 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2"><UserGroupIcon className="w-7 h-7 text-primary-400" />Користувачі</h2>
          <div className="overflow-x-auto">
            <table className="w-full rounded-xl shadow bg-white border border-gray-200 text-left text-base">
              <thead>
                <tr className="bg-primary-100 text-primary-800">
                  <th className="p-2 font-bold">Імʼя</th>
                  <th className="p-2 font-bold">Email</th>
                  <th className="p-2 font-bold">Роль</th>
                  <th className="p-2 font-bold">Дата реєстрації</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-t hover:bg-primary-50 transition-colors">
                    <td className="p-2 font-medium">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role === 'admin' ? 'Адміністратор' : 'Користувач'}</td>
                    <td className="p-2">{new Date(user.createdAt).toLocaleString('uk-UA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white/90 rounded-3xl shadow-2xl p-10 border border-primary-100 flex flex-col justify-between min-h-[420px]">
          <h2 className="text-2xl font-bold mb-4 text-primary-700 text-center flex items-center gap-2"><ClipboardDocumentListIcon className="w-7 h-7 text-primary-400" />Історія всіх замовлень</h2>
          {ordersLoading ? (
            <div className="text-center text-gray-500">Завантаження замовлень...</div>
          ) : ordersError ? (
            <div className="text-center text-red-500 flex items-center gap-2 justify-center"><XCircleIcon className="w-5 h-5" />{ordersError}</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500">Замовлень немає.</div>
          ) : (
            <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2">
              {orders.map(order => (
                <div key={order._id} className="bg-gray-50 rounded-2xl shadow p-4 hover:shadow-lg transition-shadow">
                  <div className="flex flex-wrap gap-4 justify-between items-center mb-2">
                    <span className="font-semibold">Дата: {new Date(order.date).toLocaleDateString()}</span>
                    <span className="font-semibold">Статус: {order.status}</span>
                    <span className="font-semibold">Сума: {order.total} грн</span>
                    <span className="font-semibold">Користувач: {order.user?.name || '—'} ({order.user?.email || '—'})</span>
                  </div>
                  <span className="font-semibold">Товари:</span>
                  <ul className="list-disc ml-6">
                    {order.items.map((item: any, idx: number) => {
                      const image = item.image || item.product?.image;
                      const name = item.name || item.product?.name || 'Товар';
                      const salePrice = item.salePrice ?? item.product?.salePrice;
                      const price = item.price ?? item.product?.price;
                      return (
                        <li key={idx} className="flex items-center gap-3 py-1">
                          {image && <img src={image} alt={name} className="w-10 h-10 object-contain rounded bg-gray-100" />}
                          <span>{name}</span> — {item.quantity} шт. — {' '}
                          {salePrice ? (
                            <>
                              <span className="line-through text-gray-400 mr-2">{price * item.quantity} грн</span>
                              <span>{salePrice * item.quantity} грн</span>
                            </>
                          ) : (
                            <span>{price * item.quantity} грн</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {order.cancellationReason && (
                    <div className="text-red-500 mt-2 flex items-center gap-2"><XCircleIcon className="w-5 h-5" />Причина скасування: {order.cancellationReason}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <AddProductForm />
      <ProductList />
    </div>
  )
} 