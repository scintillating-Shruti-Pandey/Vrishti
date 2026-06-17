import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './Pages.css';

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();

  if (loading) return <div className="page-container"><Loader size="lg" /></div>;

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="section-title">My Wishlist</h1>
        <p className="section-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
          {wishlist.products.length} item{wishlist.products.length !== 1 ? 's' : ''} saved
        </p>

        {wishlist.products.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">❤️</span>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love by tapping the heart icon</p>
            <Link to="/store" className="btn btn-primary">Browse Store</Link>
          </div>
        ) : (
          <div className="products-grid">
            {wishlist.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
