import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Order {
  _id: string;
  date: string;
  user: { name: string; email: string };
  total: number;
  status: string;
  items: Array<{ product: { name: string; price: number; salePrice?: number }; quantity: number }>;
  cancellationReason?: string;
  promoCode?: string;
  promoDiscount?: number;
}

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load orders');
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-[70vh] p-8">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-primary-700">Всі замовлення</h1>
      {orders.length === 0 ? (
        <p className="text-center">Немає замовлень.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-soft p-6">
              <p><strong>Дата:</strong> {new Date(order.date).toLocaleDateString()}</p>
              <p><strong>Користувач:</strong> {order.user.name} ({order.user.email})</p>
              <p><strong>Сума:</strong> {order.total} грн</p>
              <p><strong>Статус:</strong> {order.status}</p>
              {order.promoCode && order.promoDiscount !== undefined && order.promoDiscount > 0 && (
                <p className="text-green-700 font-semibold mb-2">Промокод: {order.promoCode} (−{order.promoDiscount} грн)</p>
              )}
              <p><strong>Товари:</strong></p>
              <ul>
                {order.items.map((item, index) => {
                  const image = (item as any).image ?? (item as any).product?.image;
                  const name = (item as any).name || item.product?.name || 'Товар';
                  const salePrice = (item as any).salePrice ?? item.product?.salePrice;
                  const price = (item as any).price ?? item.product?.price;
                  return (
                    <li key={index} className="flex items-center gap-3">
                      {image && <img src={image} alt={name} className="w-12 h-12 object-contain rounded bg-gray-100" />}
                      <span>{name}</span> - {item.quantity} шт. - {' '}
                      {salePrice ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">{price * item.quantity} грн</span>
                          <span>{salePrice * item.quantity} грн</span>
                        </>
                      ) : (
                        <span>{price * item.quantity} грн</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              {order.cancellationReason && (
                <p><strong>Причина скасування:</strong> {order.cancellationReason}</p>
              )}
              <button
                className="btn-secondary mt-4"
                onClick={() => setSelectedOrder(order)}
              >
                Деталі
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-soft">
            <h2 className="text-2xl font-bold mb-4">Деталі замовлення</h2>
            <p><strong>Дата:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
            <p><strong>Користувач:</strong> {selectedOrder.user.name} ({selectedOrder.user.email})</p>
            <p><strong>Сума:</strong> {selectedOrder.total} грн</p>
            <p><strong>Статус:</strong> {selectedOrder.status}</p>
            {selectedOrder.promoCode && selectedOrder.promoDiscount !== undefined && selectedOrder.promoDiscount > 0 && (
              <p className="text-green-700 font-semibold mb-2">Промокод: {selectedOrder.promoCode} (−{selectedOrder.promoDiscount} грн)</p>
            )}
            <p><strong>Товари:</strong></p>
            <ul>
              {selectedOrder.items.map((item, index) => {
                const image = (item as any).image ?? (item as any).product?.image;
                const name = (item as any).name || item.product?.name || 'Товар';
                const salePrice = (item as any).salePrice ?? item.product?.salePrice;
                const price = (item as any).price ?? item.product?.price;
                return (
                  <li key={index} className="flex items-center gap-3">
                    {image && <img src={image} alt={name} className="w-12 h-12 object-contain rounded bg-gray-100" />}
                    <span>{name}</span> - {item.quantity} шт. - {' '}
                    {salePrice ? (
                      <>
                        <span className="line-through text-gray-400 mr-2">{price * item.quantity} грн</span>
                        <span>{salePrice * item.quantity} грн</span>
                      </>
                    ) : (
                      <span>{price * item.quantity} грн</span>
                    )}
                  </li>
                );
              })}
            </ul>
            {selectedOrder.cancellationReason && (
              <p><strong>Причина скасування:</strong> {selectedOrder.cancellationReason}</p>
            )}
            <button
              className="btn-secondary mt-4"
              onClick={() => setSelectedOrder(null)}
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 