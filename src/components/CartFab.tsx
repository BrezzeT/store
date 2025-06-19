"use client"
import Link from 'next/link'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCart } from '../app/cart/CartContext'
import { useState } from 'react'

export default function CartFab() {
  const { cart, removeFromCart } = useCart()
  const [open, setOpen] = useState(false)
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl relative transition-all"
        onClick={() => setOpen(v => !v)}
        aria-label="Корзина"
      >
        <ShoppingCartIcon className="h-9 w-9" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center border-2 border-white">
            {count}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl p-4 animate-fade-in border border-primary-100">
          <h3 className="text-lg font-bold mb-3 text-primary-700">Корзина</h3>
          {cart.length === 0 ? (
            <div className="text-gray-500 text-center py-8">Корзина порожня</div>
          ) : (
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
              {cart.map(item => (
                <div key={item._id} className="flex items-center gap-3 border-b pb-2 last:border-b-0">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded bg-gray-100" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                    <div className="text-primary-700 font-bold text-sm">{item.price} грн</div>
                    <div className="text-gray-500 text-xs">x{item.quantity}</div>
                  </div>
                  <button className="text-xs text-red-500" onClick={() => removeFromCart(item._id)}>✕</button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <span className="font-bold text-primary-800">Всього:</span>
            <span className="font-bold text-lg text-primary-800">{total} грн</span>
          </div>
          <Link href="/cart" className="btn-primary w-full mt-4 block text-center" onClick={() => setOpen(false)}>
            Перейти до корзини
          </Link>
        </div>
      )}
    </div>
  )
} 