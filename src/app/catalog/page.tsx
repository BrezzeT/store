import { Suspense } from 'react'
import CatalogClient from './CatalogClient'

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Завантаження...</div>}>
      <CatalogClient />
    </Suspense>
  )
} 