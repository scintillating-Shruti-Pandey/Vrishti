import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/Loader';
import './Pages.css';

export default function CartPage() {
  const { cart, cartTotal, loading, updateQuantity, removeFromCart } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (checkoutOpen && user?.address) {
      setAddress({
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        pincode: user.address.pincode || ''
      });
    }
  }, [checkoutOpen, user]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.warning('Please fill in all address fields'); return;
    }
    setPlacing(true);
    try {
      const res = await api.post('/orders/checkout', { shippingAddress: address });
      updateUser({ wallet: res.data.newBalance });
      toast.success('Order placed successfully! 🎉');
      setCheckoutOpen(false);
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div className="page-container"><Loader size="lg" /></div>;

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="section-title">Shopping Cart</h1>
        <p className="section-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
          {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart
        </p>

        {cart.items.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Discover beautiful clothes and add them to your cart</p>
            <Link to="/store" className="btn btn-primary">Browse Store</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item__image">
                    <Link to={`/product/${item.product?._id}`}>
                      <img src={item.product?.images?.[0] || '/images/placeholder.jpg'} alt={item.product?.name} />
                    </Link>
                  </div>
                  <div className="cart-item__info">
                    <Link to={`/product/${item.product?._id}`} className="cart-item__name">{item.product?.name}</Link>
                    <p className="cart-item__meta">Size: {item.selectedSize} • Color: {item.selectedColor}</p>
                    <div className="cart-item__actions">
                      <div className="cart-item__quantity">
                        <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}><FiMinus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><FiPlus size={14} /></button>
                      </div>
                      <span className="cart-item__price">₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}</span>
                      <button className="cart-item__remove" onClick={() => { removeFromCart(item._id); toast.success('Removed from cart'); }}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="cart-summary__row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
              <div className="cart-summary__row"><span>Delivery</span><span>{cartTotal >= 999 ? 'Free' : '₹99'}</span></div>
              <div className="cart-summary__total">
                <span>Total</span>
                <span>₹{(cartTotal + (cartTotal >= 999 ? 0 : 99)).toLocaleString('en-IN')}</span>
              </div>
              <div className="cart-summary__row" style={{ color: user?.wallet >= cartTotal ? 'var(--color-success)' : 'var(--color-error)' }}>
                <span>Wallet Balance</span>
                <span>₹{(user?.wallet || 0).toLocaleString('en-IN')}</span>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => setCheckoutOpen(true)}>
                Checkout <FiArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {checkoutOpen && (
          <div className="checkout-overlay" onClick={(e) => { if (e.target === e.currentTarget) setCheckoutOpen(false); }}>
            <div className="checkout-modal animate-scale-in">
              <h2>Shipping Address</h2>
              <form onSubmit={handleCheckout} className="checkout-form" autoComplete="off">
                <div className="input-group">
                  <label>Street Address</label>
                  <input className="input-field" placeholder="123 Rain Street" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} required autoComplete="new-password" />
                </div>
                <div className="input-group">
                  <label>City</label>
                  <input className="input-field" placeholder="Mumbai" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} required autoComplete="new-password" />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <input className="input-field" placeholder="Maharashtra" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} required autoComplete="new-password" />
                </div>
                <div className="input-group">
                  <label>Pincode</label>
                  <input className="input-field" placeholder="400001" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} required autoComplete="new-password" />
                </div>
                <div className="cart-summary__total">
                  <span>Pay from Wallet</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={placing}>
                  {placing ? 'Placing Order...' : 'Place Order ✨'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setCheckoutOpen(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
