import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiHeart, FiCreditCard, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        name: form.name,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
      });
      updateUser(res.data.user);
      toast.success('Profile updated! ✨');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 'var(--space-8)' }}>My Profile</h1>

        <div className="profile-grid">
          <div className="profile-sidebar">
            <div className="profile-sidebar__avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user?.name?.charAt(0)?.toUpperCase()
              )}
            </div>
            <p className="profile-sidebar__name">{user?.name}</p>
            <p className="profile-sidebar__email">{user?.email}</p>
            <span className="badge badge-primary" style={{ margin: '0 auto' }}>
              {user?.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
            </span>

            <div className="profile-sidebar__links">
              <Link to="/orders" className="profile-sidebar__link"><FiPackage size={18} /> My Orders</Link>
              <Link to="/wishlist" className="profile-sidebar__link"><FiHeart size={18} /> Wishlist</Link>
              <Link to="/wallet" className="profile-sidebar__link"><FiCreditCard size={18} /> Wallet — ₹{(user?.wallet || 0).toLocaleString('en-IN')}</Link>
              <Link to="/cart" className="profile-sidebar__link"><FiShoppingBag size={18} /> Cart</Link>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <form onSubmit={handleSave} className="profile-form" autoComplete="off">
                <div className="input-group">
                  <label>Full Name</label>
                  <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input className="input-field" value={user?.email} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="input-group">
                  <label>Street</label>
                  <input className="input-field" placeholder="123 Rain Street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} autoComplete="new-password" />
                </div>
                <div className="input-group">
                  <label>City</label>
                  <input className="input-field" placeholder="Mumbai" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} autoComplete="new-password" />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <input className="input-field" placeholder="Maharashtra" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} autoComplete="new-password" />
                </div>
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Pincode</label>
                  <input className="input-field" placeholder="400001" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} autoComplete="new-password" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ gridColumn: 'span 2', justifySelf: 'start' }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
