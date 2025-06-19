"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useEffect, useState, useRef } from 'react'
import { useCart } from '../app/cart/CartContext'

export default function Navbar() {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const { cart } = useCart()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    setIsAuth(!!localStorage.getItem('token'))
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
      // Отримання підказок з API
      fetch(`/api/products/suggestions?search=${encodeURIComponent(searchQuery.trim())}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.suggestions || [])
        })
    } else {
      setSuggestions([])
      router.push('/catalog') // Додаю редірект на каталог при очищенні поля
    }
  }, [searchQuery, router])

  // Закривати підказки при кліку поза полем
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!inputRef.current) return
      if (!(e.target instanceof Node)) return
      if (!inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (localStorage.getItem('token')) {
      router.push('/account')
    } else {
      router.push('/login')
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.name)
    setSuggestions([])
    router.push(`/catalog?search=${encodeURIComponent(suggestion.name)}`)
  }

  const handleFocus = () => {
    if (suggestions.length > 0 || searchQuery.trim()) setShowSuggestions(true)
  }
  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100) // дати час на клік по підказці
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-primary-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Логотип */}
          <Link href="/" className="text-3xl font-extrabold text-primary-600 hover:text-primary-700 transition-colors tracking-tight">
            Малятко
          </Link>

          {/* Пошук */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder="Пошук товарів..."
                className="input-primary pl-12 text-lg h-14 rounded-xl shadow focus:ring-2 focus:ring-primary-200 transition-all"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              {/* Підказки */}
              {showSuggestions && (
                <>
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-1 z-50 border border-gray-100 animate-fade-in">
                      {suggestions.map(suggestion => (
                        <div
                          key={suggestion._id}
                          className="px-4 py-3 cursor-pointer hover:bg-primary-50 text-base transition-colors"
                          onMouseDown={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {searchQuery.trim() && suggestions.length === 0 && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-1 z-50 border border-gray-100 animate-fade-in px-4 py-3 text-gray-400 text-base">
                      Нічого не знайдено
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Навігація */}
          <div className="hidden md:flex items-center gap-6 text-lg">
            <Link href="/catalog" className="nav-link px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors font-semibold text-base">Каталог</Link>
            <Link href="/about" className="nav-link px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors font-semibold text-base">Про нас</Link>
            <Link href="/contacts" className="nav-link px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors font-semibold text-base">Контакти</Link>
          </div>

          {/* Іконки */}
          <div className="flex items-center gap-4 ml-4">
            <Link 
              href="/cart" 
              className="text-gray-600 hover:text-primary-600 transition-colors relative group"
            >
              <ShoppingCartIcon className="h-8 w-8" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center group-hover:bg-primary-700 transition-colors">
                  {cartCount}
                </span>
              )}
            </Link>
            <a
              href={isAuth ? "/account" : "/login"}
              className="text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
              onClick={handleAccountClick}
            >
              <UserIcon className="h-8 w-8" />
            </a>
          </div>

          {/* Мобільне меню (бургер) */}
          {/* TODO: Додати бургер-меню для mobile */}
        </div>
      </div>
    </nav>
  )
} 