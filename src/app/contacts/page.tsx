import React from 'react';

export default function ContactsPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl min-h-[70vh] flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-4">Контакти</h1>
        <p className="text-lg mb-2">Телефон: <a href="tel:999999999" className="text-primary-600 hover:underline">999999999</a></p>
        <p className="text-lg mb-2">Місто: Чернігів</p>
        <p className="text-lg">Ми завжди раді допомогти вам з вибором техніки та відповісти на всі ваші питання!</p>
      </div>
    </main>
  );
} 