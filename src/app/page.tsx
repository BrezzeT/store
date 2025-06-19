import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero секція */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-32 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl font-extrabold mb-8 text-white animate-slide-down">
              Ласкаво просимо до нашого магазину
            </h1>
            <p className="text-2xl mb-10 text-white animate-slide-up">
              Знайдіть найкращі товари за найкращими цінами
            </p>
            <Link 
              href="/catalog" 
              className="btn-accent inline-block animate-bounce-slow"
            >
              Перейти до каталогу
            </Link>
          </div>
        </div>
      </section>

      {/* Популярні категорії */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Популярні категорії</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/catalog?category=${category.slug}`}
                className="card group overflow-hidden"
              >
                <div className="relative h-64">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h3 className="text-white text-2xl font-semibold">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Переваги */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-primary-600 text-4xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

const categories = [
  {
    id: 1,
    name: 'Електроніка',
    slug: 'electronics',
    image: '/images/categories/electronics.jpg'
  },
  {
    id: 2,
    name: 'Одяг',
    slug: 'clothing',
    image: '/images/categories/clothing.jpg'
  },
  {
    id: 3,
    name: 'Побутова техніка',
    slug: 'appliances',
    image: '/images/categories/appliances.jpg'
  }
]

const features = [
  {
    id: 1,
    title: 'Швидка доставка',
    description: 'Доставляємо замовлення по всій Україні протягом 1-3 днів',
    icon: '🚚'
  },
  {
    id: 2,
    title: 'Гарантія якості',
    description: 'Всі товари проходять перевірку перед відправкою',
    icon: '✅'
  },
  {
    id: 3,
    title: 'Підтримка 24/7',
    description: 'Наші консультанти завжди готові допомогти вам',
    icon: '💬'
  }
] 