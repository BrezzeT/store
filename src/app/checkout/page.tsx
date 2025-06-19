"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../cart/CartContext';

export default function Checkout() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usedBonus, setUsedBonus] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [useBonus, setUseBonus] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);

  useEffect(() => {
    // Зчитую використані бонуси з localStorage
    const bonus = Number(localStorage.getItem('usedBonus') || '0');
    setUsedBonus(bonus);
    setBonusPoints(bonus);
    setPromoCode(localStorage.getItem('promoCode') || '')
    setDiscount(Number(localStorage.getItem('discount') || '0'))
    setUseBonus(localStorage.getItem('useBonus') === 'true')
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Будь ласка, увійдіть для оформлення замовлення');
      setLoading(false);
      return;
    }

    const total = cart.reduce((sum, item) => sum + ((item.salePrice ?? item.price) * item.quantity), 0);
    const totalWithDiscount = Math.max(0, total - discount - (useBonus ? Math.min(bonusPoints, total - discount) : 0));

    const orderData = {
      items: cart.map(item => ({
        product: item._id,
        name: item.name,
        price: item.price,
        salePrice: item.salePrice,
        image: item.image,
        quantity: item.quantity
      })),
      total: totalWithDiscount,
      promoCode: promoCode || null,
      promoDiscount: discount || 0,
      phone,
      address,
      comment,
      usedBonus
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Не вдалося оформити замовлення');
      }

      clearCart();
      localStorage.removeItem('usedBonus');
      localStorage.removeItem('promoCode');
      localStorage.removeItem('discount');
      localStorage.removeItem('useBonus');
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Сталася помилка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-soft mt-10 mb-16 animate-fade-in border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-primary-700">Оформлення замовлення</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Телефон</label>
            <input
              type="tel"
              className="input-primary text-lg h-12"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              placeholder="+380..."
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Адреса</label>
            <input
              type="text"
              className="input-primary text-lg h-12"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
              placeholder="Місто, вулиця, будинок, квартира"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Коментар (опціонально)</label>
            <textarea
              className="input-primary text-lg h-24"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Додаткові побажання до замовлення..."
            />
          </div>
          {error && <div className="text-red-500 text-center font-semibold border border-red-200 bg-red-50 rounded-xl py-2 px-4">{error}</div>}
          <div className="flex gap-4 mt-6">
            <button type="submit" className="btn-primary flex-1 text-lg" disabled={loading}>
              {loading ? 'Обробка...' : 'Підтвердити замовлення'}
            </button>
            <button
              type="button"
              className="btn-secondary flex-1 text-lg"
              onClick={() => router.push('/cart')}
            >
              Повернутися до корзини
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 