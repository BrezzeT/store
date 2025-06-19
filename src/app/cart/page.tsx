"use client"
import { useCart } from './CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')
  const [discount, setDiscount] = useState(0)
  const [bonusPoints, setBonusPoints] = useState(0)
  const [useBonus, setUseBonus] = useState(false)
  const [bonusApplied, setBonusApplied] = useState(0)
  const router = useRouter()

  // Отримати бонуси користувача з API профілю
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch('/api/account/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setBonusPoints(data.user?.bonusPoints ?? 0)
      })
      .catch(() => setBonusPoints(0))
  }, [])

  const total = cart.reduce((sum, item) => sum + ((item.salePrice ?? item.price) * item.quantity), 0)
  const totalWithDiscount = Math.max(0, total - discount - (useBonus ? Math.min(bonusPoints, total - discount) : 0))

  const handleApplyPromo = async () => {
    setPromoError('')
    setPromoSuccess('')
    setDiscount(0)
    if (!promoCode.trim()) return
    // TODO: замінити на реальний API
    if (promoCode === 'SALE10') {
      setDiscount(Math.floor(total * 0.1))
      setPromoSuccess('Промокод застосовано! Знижка 10%')
    } else if (promoCode === '100GRN') {
      setDiscount(100)
      setPromoSuccess('Промокод застосовано! Знижка 100 грн')
    } else {
      setPromoError('Промокод недійсний або закінчився')
    }
  }

  const handleUseBonus = () => {
    setUseBonus(!useBonus)
    if (!useBonus) {
      setBonusApplied(Math.min(bonusPoints, total - discount))
    } else {
      setBonusApplied(0)
    }
  }

  const handleCheckout = () => {
    // Зберігаю суму використаних бонусів у localStorage
    if (useBonus) {
      localStorage.setItem('usedBonus', String(Math.min(bonusPoints, total - discount)))
      localStorage.setItem('useBonus', 'true')
    } else {
      localStorage.removeItem('usedBonus')
      localStorage.setItem('useBonus', 'false')
    }
    localStorage.setItem('promoCode', promoCode)
    localStorage.setItem('discount', String(discount))
    router.push('/checkout')
  }

  return (
    <div className="min-h-[70vh] bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-10 animate-fade-in mb-16 border border-gray-100">
        <h1 className="text-4xl font-extrabold text-primary-700 mb-10 text-center">Корзина</h1>
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 py-20 text-lg">
            Ваша корзина порожня.<br />
            <Link href="/catalog" className="btn-primary mt-6 inline-block">Перейти до каталогу</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-8 mb-10">
              {cart.map(item => (
                <div key={item._id} className="flex items-center gap-6 border-b pb-6 last:border-b-0 animate-fade-in">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-contain rounded-xl bg-gray-100 shadow" />
                  <div className="flex-1">
                    <div className="font-bold text-xl text-gray-900 mb-1">{item.name}</div>
                    <div className="text-primary-700 font-extrabold text-lg mb-1">
                      {item.salePrice ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">{item.price} грн</span>
                          <span>{item.salePrice} грн</span>
                        </>
                      ) : (
                        <span>{item.price} грн</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary-100 transition-colors text-xl font-bold border border-gray-200"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="text-gray-700 text-lg font-semibold">{item.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary-100 transition-colors text-xl font-bold border border-gray-200"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="btn-accent px-6 py-3 text-base rounded-xl"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Видалити
                  </button>
                </div>
              ))}
            </div>
            {/* Промокод */}
            <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                className="input-primary text-lg h-12 w-64"
                placeholder="Промокод"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
              />
              <button className="btn-outline h-12 px-6" onClick={handleApplyPromo}>Застосувати</button>
              {promoError && <div className="text-red-500 text-sm mt-2 sm:mt-0">{promoError}</div>}
              {promoSuccess && <div className="text-green-600 text-sm mt-2 sm:mt-0">{promoSuccess}</div>}
            </div>
            {/* Бонуси */}
            <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="text-lg">Ваші бонуси: <span className="font-bold text-primary-700">{bonusPoints}</span></div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={useBonus} onChange={handleUseBonus} className="accent-primary-600 w-5 h-5 rounded focus:ring-2 focus:ring-primary-400" />
                Використати бонуси ({Math.min(bonusPoints, total - discount)} грн)
              </label>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-10">
              <div className="text-2xl font-extrabold text-primary-800">Всього: <span className={discount || bonusApplied ? 'line-through text-gray-400 mr-2' : ''}>{total} грн</span>{' '}
                {(discount || bonusApplied) && <span className="text-primary-700">{totalWithDiscount} грн</span>}
              </div>
              <div className="flex gap-4">
                <button className="btn-outline" onClick={clearCart}>Очистити корзину</button>
                <button className="btn-primary" onClick={handleCheckout}>Оформити замовлення</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 