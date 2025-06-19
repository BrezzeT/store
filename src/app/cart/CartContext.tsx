"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type CartItem = {
  _id: string
  name: string
  price: number
  salePrice?: number
  image: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  updateQuantity: (id: string, quantity: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) setCart(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id)
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i)
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i._id !== id))
  }

  const clearCart = () => setCart([])

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    setCart(prev => prev.map(item => 
      item._id === id ? { ...item, quantity } : item
    ))
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  )
} 