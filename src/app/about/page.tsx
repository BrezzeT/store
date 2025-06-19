import React from 'react';

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl min-h-[70vh] flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-4">Про нас</h1>
        <p className="text-lg mb-2">Ми — магазин техніки, який пропонує широкий вибір сучасних електронних пристроїв, побутової техніки та аксесуарів для дому й офісу.</p>
        <p className="text-lg mb-2">Наша мета — зробити якісну техніку доступною для кожного. Ми цінуємо довіру наших клієнтів і прагнемо забезпечити найкращий сервіс.</p>
      </div>
    </main>
  );
} 