import Link from 'next/link'
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary-900 to-primary-700 text-white mt-16">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Про магазин */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-wide">Про магазин</h3>
            <p className="text-gray-300 leading-relaxed">
              Малятко — це магазин техніки з сучасним асортиментом електроніки, побутової техніки та аксесуарів для дому й офісу. Якість, сервіс, доступність.
            </p>
          </div>

          {/* Категорії */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-wide">Категорії</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog/electronics" className="text-gray-300 hover:text-white transition-colors">Електроніка</Link>
              </li>
              <li>
                <Link href="/catalog/clothing" className="text-gray-300 hover:text-white transition-colors">Одяг</Link>
              </li>
              <li>
                <Link href="/catalog/appliances" className="text-gray-300 hover:text-white transition-colors">Побутова техніка</Link>
              </li>
            </ul>
          </div>

          {/* Інформація */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-wide">Інформація</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">Про нас</Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-300 hover:text-white transition-colors">Контакти</Link>
              </li>
            </ul>
          </div>

          {/* Контакти */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-wide">Контакти</h3>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-center gap-2"><PhoneIcon className="w-5 h-5 text-primary-200" /> 999999999</li>
              <li className="flex items-center gap-2"><EnvelopeIcon className="w-5 h-5 text-primary-200" /> store@email.com</li>
              <li className="flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-primary-200" /> м. Чернігів</li>
            </ul>
          </div>
        </div>

        {/* Нижній футер */}
        <div className="border-t border-primary-800 mt-12 pt-8 text-center text-gray-300 text-sm tracking-wide">
          <p>&copy; 2025 Малятко. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  )
} 