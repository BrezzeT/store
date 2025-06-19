"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserIcon, GiftIcon, AtSymbolIcon, CalendarIcon, ArrowRightOnRectangleIcon, CheckCircleIcon, XCircleIcon, TrophyIcon, ShoppingBagIcon, TagIcon } from '@heroicons/react/24/outline'

const QUESTS = [
  { id: 'profile', title: 'Заповнити профіль', description: 'Заповніть або змініть свої дані профілю.' },
  { id: 'order', title: 'Перше замовлення', description: 'Зробіть своє перше замовлення.' },
  { id: 'subscribe', title: 'Підписатися на розсилку', description: 'Підпишіться на email-розсилку.' },
]

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState('')
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [questLoading, setQuestLoading] = useState<string | null>(null)
  const [questError, setQuestError] = useState('')
  const [questSuccess, setQuestSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }
    fetch('/api/account/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          if (data.user.role === 'admin') {
            router.replace('/admin')
            return
          }
          setUser(data.user)
        } else {
          setError(data.message || 'Помилка')
          if (
            data.message === 'Не авторизовано' ||
            data.message === 'Недійсний токен' ||
            data.message === 'Користувача не знайдено'
          ) {
            localStorage.removeItem('token')
            router.replace('/login')
            return
          }
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Помилка при завантаженні профілю')
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.replace('/login')
  }

  const handleCancelOrder = async () => {
    if (!cancelOrderId || !cancelReason) return;
    setCancelLoading(true);
    setCancelError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setCancelError('Будь ласка, увійдіть');
      setCancelLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/orders/${cancelOrderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: cancelReason })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Не вдалося скасувати замовлення');
      }
      setOrders(orders => orders.map(order =>
        order._id === cancelOrderId
          ? { ...order, status: 'cancelled', cancellationReason: cancelReason }
          : order
      ));
      setCancelOrderId(null);
      setCancelReason('');
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : 'Сталася помилка');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleQuest = async (questId: string) => {
    setQuestLoading(questId)
    setQuestError('')
    setQuestSuccess('')
    const token = localStorage.getItem('token')
    if (!token) {
      setQuestError('Необхідно увійти')
      setQuestLoading(null)
      return
    }
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ questId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Помилка')
      setUser((u: any) => ({ ...u, bonusPoints: data.bonusPoints, quests: data.quests }))
      setQuestSuccess('Бонуси нараховано!')
    } catch (e: any) {
      setQuestError(e.message)
    } finally {
      setQuestLoading(null)
    }
  }

  if (loading) return <div className="p-8 text-center">Завантаження...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-100 py-10">
      <div className="w-full max-w-3xl p-6 sm:p-10 bg-white/90 rounded-3xl shadow-2xl animate-fade-in flex flex-col items-center gap-8 mb-16 border border-primary-100">
        {/* Профіль */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center shadow-md">
            <UserIcon className="w-12 h-12 text-primary-600" />
          </div>
          <div className="flex-1 flex flex-col gap-2 text-lg">
            <div className="flex items-center gap-2 font-semibold text-gray-700">
              <AtSymbolIcon className="w-5 h-5 text-primary-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-gray-700">
              <UserIcon className="w-5 h-5 text-primary-400" />
              <span>{user.name}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-gray-700">
              <CalendarIcon className="w-5 h-5 text-primary-400" />
              <span>Зареєстровано: {new Date(user.createdAt).toLocaleString('uk-UA')}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-primary-700 mt-2">
              <GiftIcon className="w-5 h-5 text-yellow-500" />
              <span>Бонуси: <span className="font-bold">{user.bonusPoints ?? 0}</span></span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-green-700 mt-2">
              <TagIcon className="w-5 h-5 text-green-500" />
              <span>Промокод: <span className="font-bold">SALE10</span> (10% знижка)</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-accent mt-4 sm:mt-0 px-6 py-2 text-base font-semibold flex items-center gap-2 shadow hover:scale-105 transition-transform"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" /> Вийти
          </button>
        </div>
        {/* Квести */}
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4 text-primary-700 flex items-center gap-2"><TrophyIcon className="w-6 h-6 text-yellow-500" /> Міні-квести для бонусів</h2>
          <ul className="grid sm:grid-cols-3 gap-4">
            {QUESTS.map(q => (
              <li key={q.id} className="bg-primary-50 rounded-2xl p-4 flex flex-col items-center gap-2 shadow hover:shadow-lg transition-shadow">
                <div className="font-semibold text-lg text-center">{q.title}</div>
                <div className="text-gray-600 text-base text-center">{q.description}</div>
                {user.quests?.[q.id] ? (
                  <span className="flex items-center gap-1 text-green-600 font-bold"><CheckCircleIcon className="w-5 h-5" /> Виконано</span>
                ) : (
                  <button
                    className="btn-primary px-4 py-2 mt-2 flex items-center gap-2"
                    disabled={questLoading === q.id}
                    onClick={() => handleQuest(q.id)}
                  >
                    <GiftIcon className="w-5 h-5" /> {questLoading === q.id ? 'Зачекайте...' : 'Отримати 50 бонусів'}
                  </button>
                )}
              </li>
            ))}
          </ul>
          {questError && <div className="text-red-500 text-center mt-2 flex items-center gap-2 justify-center"><XCircleIcon className="w-5 h-5" />{questError}</div>}
          {questSuccess && <div className="text-green-600 text-center mt-2 flex items-center gap-2 justify-center"><CheckCircleIcon className="w-5 h-5" />{questSuccess}</div>}
        </div>
        {/* Замовлення */}
        <div className="w-full mt-2">
          <h2 className="text-2xl font-bold mb-4 text-primary-700 flex items-center gap-2"><ShoppingBagIcon className="w-7 h-7 text-primary-400" /> Мої замовлення</h2>
          {ordersLoading ? (
            <div className="text-center text-gray-500">Завантаження замовлень...</div>
          ) : ordersError ? (
            <div className="text-center text-red-500 flex items-center gap-2 justify-center"><XCircleIcon className="w-5 h-5" />{ordersError}</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500">У вас немає замовлень.</div>
          ) : (
            <div className="grid gap-4">
              {orders.map(order => (
                <div key={order._id} className="bg-gray-50 rounded-2xl shadow p-4 hover:shadow-lg transition-shadow">
                  <div className="flex flex-wrap gap-4 justify-between items-center mb-2">
                    <span className="font-semibold">Дата: {new Date(order.date).toLocaleDateString()}</span>
                    <span className="font-semibold">Статус: {order.status}</span>
                    <span className="font-semibold">Сума: {order.total} грн</span>
                  </div>
                  {order.promoCode && order.promoDiscount > 0 && (
                    <div className="text-green-700 font-semibold mb-2">Промокод: {order.promoCode} (−{order.promoDiscount} грн)</div>
                  )}
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
                  {order.status === 'pending' && (
                    <button
                      className="btn-secondary mt-4"
                      onClick={() => setCancelOrderId(order._id)}
                    >
                      Відмінити замовлення
                    </button>
                  )}
                  {order.cancellationReason && (
                    <div className="text-red-500 mt-2 flex items-center gap-2"><XCircleIcon className="w-5 h-5" />Причина скасування: {order.cancellationReason}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Модалка для причини скасування */}
        {cancelOrderId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-primary-100">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><XCircleIcon className="w-6 h-6 text-red-500" />Відмінити замовлення</h2>
              <textarea
                className="input-primary text-lg h-24 mb-4 w-full"
                placeholder="Введіть причину скасування"
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
              />
              {cancelError && <div className="text-red-500 text-center mb-2 flex items-center gap-2 justify-center"><XCircleIcon className="w-5 h-5" />{cancelError}</div>}
              <div className="flex gap-4">
                <button
                  className="btn-primary flex-1"
                  onClick={handleCancelOrder}
                  disabled={cancelLoading || !cancelReason}
                >
                  {cancelLoading ? 'Відміна...' : 'Підтвердити'}
                </button>
                <button
                  className="btn-secondary flex-1"
                  onClick={() => {
                    setCancelOrderId(null);
                    setCancelReason('');
                    setCancelError('');
                  }}
                >
                  Скасувати
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 