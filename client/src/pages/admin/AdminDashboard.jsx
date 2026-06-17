import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiPackage, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import '../../pages/Pages.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, productsRes, ordersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/products?limit=100'),
          api.get('/admin/orders'),
        ]);
        setStats(statsRes.data.stats);
        setProducts(productsRes.data.products);
        setOrders(ordersRes.data.orders);
      } catch (error) {
        console.error('Admin fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      setOrders(orders.map((o) => o._id === orderId ? { ...o, status } : o));
      toast.success(`Order status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="page-container"><Loader size="lg" /></div>;

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1 className="section-title">🛡️ Admin Panel</h1>
          <Link to="/admin/add-product" className="btn btn-primary"><FiPlus size={18} /> Add Product</Link>
        </div>

        {stats && (
          <div className="admin-stats">
            <div className="admin-stat-card"><p className="admin-stat-card__label">Products</p><p className="admin-stat-card__value">{stats.totalProducts}</p></div>
            <div className="admin-stat-card"><p className="admin-stat-card__label">Orders</p><p className="admin-stat-card__value">{stats.totalOrders}</p></div>
            <div className="admin-stat-card"><p className="admin-stat-card__label">Customers</p><p className="admin-stat-card__value">{stats.totalUsers}</p></div>
            <div className="admin-stat-card"><p className="admin-stat-card__label">Revenue</p><p className="admin-stat-card__value">₹{stats.totalRevenue.toLocaleString('en-IN')}</p></div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          <button className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('products')}>
            <FiPackage size={16} /> Products
          </button>
          <button className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('orders')}>
            <FiPackage size={16} /> Orders
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="card" style={{ overflow: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td><span className="badge badge-primary">{p.category}</span></td>
                    <td>₹{p.price.toLocaleString('en-IN')}</td>
                    <td>{p.stock}</td>
                    <td>{p.averageRating.toFixed(1)} ⭐</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Link to={`/admin/edit-product/${p._id}`} className="btn btn-ghost btn-sm"><FiEdit2 size={14} /></Link>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteProduct(p._id)}><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card" style={{ overflow: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)' }}>#{o._id.slice(-8).toUpperCase()}</td>
                    <td>{o.user?.name || 'N/A'}</td>
                    <td>{o.items.length} items</td>
                    <td style={{ fontWeight: 600 }}>₹{o.totalAmount.toLocaleString('en-IN')}</td>
                    <td><span className={`order-card__status order-card__status--${o.status}`}>{o.status}</span></td>
                    <td>
                      <select
                        className="input-field"
                        style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', minWidth: 120 }}
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
