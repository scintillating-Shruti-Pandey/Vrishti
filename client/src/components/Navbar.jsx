import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiCreditCard, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const isHome = location.pathname === '/';
  const searchParams = new URLSearchParams(location.search);
  const activeGender = searchParams.get('gender');
  const hasMultipleGenders = activeGender && activeGender.includes(',');
  const isStore = location.pathname === '/store';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isHome && !scrolled ? 'navbar--transparent' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">Vrishti</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar__links">
          <Link to="/store" className={`navbar__link ${isStore && (!activeGender || hasMultipleGenders) ? 'active' : ''}`}>Store</Link>
          <Link to="/store?gender=Women&ageGroup=Adults+(20%2B)" className={`navbar__link ${activeGender === 'Women' ? 'active' : ''}`}>Women</Link>
          <Link to="/store?gender=Men&ageGroup=Adults+(20%2B)" className={`navbar__link ${activeGender === 'Men' ? 'active' : ''}`}>Men</Link>
          <Link to="/store?gender=Girls&ageGroup=Kids+(2-12)" className={`navbar__link ${activeGender === 'Girls' ? 'active' : ''}`}>Girls</Link>
          <Link to="/store?gender=Boys&ageGroup=Kids+(2-12)" className={`navbar__link ${activeGender === 'Boys' ? 'active' : ''}`}>Boys</Link>
        </div>

        {/* Right Section */}
        <div className="navbar__actions">
          {/* Search */}
          <div className={`navbar__search ${searchOpen ? 'navbar__search--open' : ''}`} ref={searchRef}>
            <form onSubmit={handleSearch} className="navbar__search-form">
              <input
                type="text"
                placeholder="Search for clothes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar__search-input"
              />
            </form>
            <button
              className="navbar__action-btn"
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (!searchOpen) {
                  setTimeout(() => searchRef.current?.querySelector('input')?.focus(), 200);
                }
              }}
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>
          </div>

          {/* Wishlist */}
          {isAuthenticated && (
            <Link to="/wishlist" className="navbar__action-btn navbar__action-btn--badge" aria-label="Wishlist">
              <FiHeart size={20} />
              {wishlistCount > 0 && <span className="navbar__badge">{wishlistCount}</span>}
            </Link>
          )}

          {/* Cart */}
          {isAuthenticated && (
            <Link to="/cart" className="navbar__action-btn navbar__action-btn--badge" aria-label="Cart">
              <FiShoppingCart size={20} />
              {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
            </Link>
          )}

          {/* Wallet Badge */}
          {isAuthenticated && (
            <Link to="/wallet" className="navbar__wallet-badge" aria-label="Wallet">
              <FiCreditCard size={16} />
              <span>₹{(user?.wallet || 0).toLocaleString('en-IN')}</span>
            </Link>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="navbar__user-menu" ref={userMenuRef}>
              <button
                className="navbar__avatar-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="navbar__avatar-img" />
                ) : (
                  <span className="navbar__avatar-initial">{user?.name?.charAt(0)?.toUpperCase()}</span>
                )}
              </button>

              {userMenuOpen && (
                <div className="navbar__dropdown animate-fade-in-down">
                  <div className="navbar__dropdown-header">
                    <p className="navbar__dropdown-name">{user?.name}</p>
                    <p className="navbar__dropdown-email">{user?.email}</p>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <Link to="/profile" className="navbar__dropdown-item">
                    <FiUser size={16} /> Profile
                  </Link>
                  <Link to="/orders" className="navbar__dropdown-item">
                    <FiPackage size={16} /> Orders
                  </Link>
                  <Link to="/wallet" className="navbar__dropdown-item">
                    <FiCreditCard size={16} /> Wallet
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="navbar__dropdown-item navbar__dropdown-item--admin">
                      <FiShield size={16} /> Admin Panel
                    </Link>
                  )}
                  <div className="navbar__dropdown-divider" />
                  <button onClick={handleLogout} className="navbar__dropdown-item navbar__dropdown-item--logout">
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="navbar__mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar__mobile-menu animate-fade-in-down">
          <form onSubmit={handleSearch} className="navbar__mobile-search">
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Search for clothes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Link to="/store" className="navbar__mobile-link">Store</Link>
          <Link to="/store?gender=Women&ageGroup=Adults+(20%2B)" className="navbar__mobile-link">Women</Link>
          <Link to="/store?gender=Men&ageGroup=Adults+(20%2B)" className="navbar__mobile-link">Men</Link>
          <Link to="/store?gender=Girls&ageGroup=Kids+(2-12)" className="navbar__mobile-link">Girls</Link>
          <Link to="/store?gender=Boys&ageGroup=Kids+(2-12)" className="navbar__mobile-link">Boys</Link>
          {isAuthenticated && (
            <>
              <Link to="/wishlist" className="navbar__mobile-link">Wishlist</Link>
              <Link to="/cart" className="navbar__mobile-link">Cart ({cartCount})</Link>
              <Link to="/orders" className="navbar__mobile-link">Orders</Link>
              <Link to="/wallet" className="navbar__mobile-link">Wallet — ₹{(user?.wallet || 0).toLocaleString('en-IN')}</Link>
              <Link to="/profile" className="navbar__mobile-link">Profile</Link>
              {isAdmin && <Link to="/admin" className="navbar__mobile-link">Admin Panel</Link>}
              <button onClick={handleLogout} className="navbar__mobile-link navbar__mobile-link--logout">Logout</button>
            </>
          )}
          {!isAuthenticated && (
            <div className="navbar__mobile-auth">
              <Link to="/login" className="btn btn-secondary" style={{ flex: 1 }}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ flex: 1 }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
