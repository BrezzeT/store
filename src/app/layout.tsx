import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from './cart/CartContext'
import CartFab from '@/components/CartFab'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'УкрМагазин - Інтернет-магазин',
  description: 'Сучасний український інтернет-магазин з широким асортиментом товарів',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <CartFab />
        </CartProvider>
      </body>
    </html>
  )
} 