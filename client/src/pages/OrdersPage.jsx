import { useState, useEffect } from 'react';
import api from '../utils/api';
import Loader from '../components/Loader';
import './Pages.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="page-container"><Loader size="lg" /></div>;

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="section-title">My Orders</h1>
        <p className="section-subtitle" style={{ marginBottom: 'var(--space-8)' }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>

        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">📦</span>
            <h3>No orders yet</h3>
            <p>Your order history will appear here after your first purchase</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card__header">
                <div>
                  <span className="order-card__id">Order #{order._id.slice(-8).toUpperCase()}</span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <span className={`order-card__status order-card__status--${order.status}`}>{order.status}</span>
              </div>
              <div className="order-card__items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <div className="order-item__image">
                      <img src={item.image || '/images/placeholder.jpg'} alt={item.name} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="order-item__name">{item.name}</p>
                      <p className="order-item__details">{item.selectedSize} • {item.selectedColor} • Qty: {item.quantity}</p>
                    </div>
                    <span className="order-item__price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="order-card__footer">
                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </span>
                <span className="order-card__total">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
