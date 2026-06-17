import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiHeart, FiFeather, FiGlobe, FiAward } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

import {
  PiDressFill,
  PiTShirtFill,
  PiShirtFoldedFill,
  PiPantsFill,
  PiFlowerLotusFill,
  PiHoodieFill
} from 'react-icons/pi';

const SherwaniIcon = ({ size = 32, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path fill={color} d="M 7 5 H 17 L 20 12 L 18 13 L 15 7 V 21 H 9 V 7 L 6 13 L 4 12 Z" />
    <path fill={color} d="M 10 5 V 3 C 10 2 14 2 14 3 V 5" />
    <line x1="12" y1="5" x2="12" y2="21" stroke="#fff" />
    <circle cx="12" cy="9" r="0.5" fill="#fff" />
    <circle cx="12" cy="13" r="0.5" fill="#fff" />
    <circle cx="12" cy="17" r="0.5" fill="#fff" />
  </svg>
);

const CoOrdsIcon = ({ size = 32, color = "currentColor" }) => (
  <div style={{ position: 'relative', width: size, height: size, color: color }}>
    <div style={{ position: 'absolute', top: -2, left: -2 }}><PiTShirtFill size={size * 0.75} /></div>
    <div style={{ position: 'absolute', bottom: -2, right: -2 }}><PiPantsFill size={size * 0.75} /></div>
  </div>
);

const categories = [
  { name: 'Sarees', icon: <PiFlowerLotusFill size={36} />, color: '#9c1e42', bg: 'rgba(156, 30, 66, 0.1)', query: 'category=Sarees&gender=Women' },
  { name: 'Dresses', icon: <PiDressFill size={36} />, color: '#b8901e', bg: 'rgba(212, 175, 55, 0.15)', query: 'category=Dresses&gender=Women,Girls' },
  { name: 'Tshirts', icon: <PiTShirtFill size={36} />, color: '#6e5f50', bg: 'rgba(110, 95, 80, 0.1)', query: 'category=Tshirts&gender=Women,Men,Girls,Boys' },
  { name: 'Shirts', icon: <PiShirtFoldedFill size={36} />, color: '#c12550', bg: 'rgba(193, 37, 80, 0.1)', query: 'category=Shirts&gender=Women,Men,Boys' },
  { name: 'Jeans', icon: <PiPantsFill size={36} />, color: '#4a4137', bg: 'rgba(74, 65, 55, 0.1)', query: 'category=Jeans&gender=Women,Men,Girls,Boys' },
  { name: 'Jackets', icon: <PiHoodieFill size={36} />, color: '#a07c1e', bg: 'rgba(160, 124, 30, 0.15)', query: 'category=Jackets&gender=Men,Boys' },
  { name: 'Co-Ords', icon: <CoOrdsIcon size={36} />, color: '#dc3e65', bg: 'rgba(220, 62, 101, 0.1)', query: 'category=Co-Ords&gender=Girls' },
  { name: 'Sherwani', icon: <SherwaniIcon size={36} />, color: '#b8901e', bg: 'rgba(212, 175, 55, 0.15)', query: 'category=Sherwani&gender=Men' },
];

const features = [
  { icon: <FiHeart size={24} />, title: 'Curated Collections', desc: 'Handpicked by our fashion experts' },
  { icon: <FiTruck size={24} />, title: 'Express Delivery', desc: 'Free delivery on orders above ₹999' },
  { icon: <FiShield size={24} />, title: 'Easy Returns', desc: 'Hassle-free returns within 7 days' },
  { icon: <FiStar size={24} />, title: 'Premium Quality', desc: 'Luxurious fabrics, lasting beauty' },
];

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products/featured');
        setFeatured(res.data.products);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home">
      {/* ---- Hero Section ---- */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__overlay" />
        {/* Decorative gold particles */}
        <div className="hero__particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="hero__particle" style={{
              left: `${15 + i * 14}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i * 0.5}s`
            }} />
          ))}
        </div>
        <div className="hero__content container">
          <div className="hero__text animate-fade-in-up">
            <span className="hero__badge">✨ New Collection 2026</span>
            <h1 className="hero__title">Vrishti</h1>
            <p className="hero__subtitle">
              Where tradition<br />meets contemporary elegance.
            </p>
            <p className="hero__desc">
              Discover fashion that celebrates Indian heritage with modern
              silhouettes — luxurious fabrics, artisan craftsmanship,
              timeless beauty.
            </p>
            <div className="hero__cta">
              <Link to="/store" className="btn btn-accent btn-lg">
                Explore Collection <FiArrowRight size={20} />
              </Link>
              <Link to="/store?category=Sarees" className="btn hero__btn-secondary btn-lg">
                Sarees
              </Link>
            </div>
          </div>
        </div>
        <div className="hero__scroll-indicator">
          <div className="hero__scroll-line" />
          <span className="hero__scroll-text">Scroll to explore</span>
        </div>
      </section>

      {/* ---- Features Strip ---- */}
      <section className="features-strip">
        <div className="container">
          <div className="features-strip__grid">
            {features.map((feat, i) => (
              <div key={i} className="features-strip__item animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="features-strip__icon">{feat.icon}</div>
                <div>
                  <h4 className="features-strip__title">{feat.title}</h4>
                  <p className="features-strip__desc">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Categories ---- */}
      <section className="home-section">
        <div className="container">
          <div className="home-section__header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Find your perfect style</p>
            </div>
            <Link to="/store" className="btn btn-secondary">View All <FiArrowRight /></Link>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/store?${cat.query || `category=${encodeURIComponent(cat.name)}`}`}
                className="category-card animate-fade-in-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="category-card__emoji" style={{ background: cat.bg, color: cat.color }}>
                  {cat.icon}
                </div>
                <span className="category-card__name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Featured Products ---- */}
      <section className="home-section home-section--alt">
        <div className="container">
          <div className="home-section__header">
            <div>
              <h2 className="section-title">Trending Now ✨</h2>
              <p className="section-subtitle">Our most loved pieces this season</p>
            </div>
            <Link to="/store?sort=popular" className="btn btn-secondary">See More <FiArrowRight /></Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '380px', borderRadius: 'var(--radius-xl)' }} />
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featured.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---- About / Brand Story ---- */}
      <section className="home-section">
        <div className="container">
          <div className="brand-story">
            <div className="brand-story__content animate-fade-in-up">
              <span className="brand-story__label">Our Story</span>
              <h2 className="brand-story__title">Fashion that honours<br />tradition, embraces now</h2>
              <p className="brand-story__text">
                Vrishti — meaning "rain" in Sanskrit — is born from the belief that fashion
                should be as natural and transformative as the first monsoon. We blend
                contemporary silhouettes with timeless Indian craftsmanship.
              </p>
              <p className="brand-story__text">
                Every piece in our collection is thoughtfully created — from luxurious
                silks and handloom cottons to modern activewear — to make you feel
                confident, elegant, and connected to something beautiful.
              </p>
              <Link to="/store?category=Sarees,Kurtas,Lehanga+Choli,Ethnic+Dresses,Dhoti+Kurta+Sets,Sherwani,Gopi+Dresses,Kurta+Sets,Suits,Blazers" className="btn btn-primary btn-lg">
                Shop Ethnic Wear <FiArrowRight size={18} />
              </Link>
            </div>
            <div className="brand-story__visual animate-fade-in-up delay-2">
              <div className="brand-story__card">
                <span className="brand-story__icon-wrapper"><FiFeather /></span>
                <p>Artisan Craftsmanship</p>
              </div>
              <div className="brand-story__card">
                <span className="brand-story__icon-wrapper"><FiAward /></span>
                <p>Premium Fabrics</p>
              </div>
              <div className="brand-story__card">
                <span className="brand-story__icon-wrapper"><FiGlobe /></span>
                <p>Heritage Inspired</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA Banner ---- */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-banner__inner">
            <div className="cta-banner__content">
              {isAuthenticated ? (
                <>
                  <h2 className="cta-banner__title">Welcome back, {user?.name?.split(' ')[0]}!</h2>
                  <p className="cta-banner__text">Explore the latest collections curated just for you.</p>
                  <Link to="/store?sort=newest" className="btn btn-accent btn-lg">
                    Shop New Arrivals <FiArrowRight size={18} />
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="cta-banner__title">Begin your style journey</h2>
                  <p className="cta-banner__text">Sign up today and get ₹10,000 in your Vrishti wallet to start shopping!</p>
                  <Link to="/signup" className="btn btn-accent btn-lg">
                    Create Account <FiArrowRight size={18} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
