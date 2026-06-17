import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import RatingStars from './RatingStars';
import { toast } from 'react-toastify';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [hoveredColor, setHoveredColor] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const wishlisted = isInWishlist(product._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please login to use wishlist');
      return;
    }

    try {
      const action = await toggleWishlist(product._id);
      toast.success(action === 'added' ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    } catch {
      toast.error('Something went wrong');
    }
  };

  let imagesList = product.images || [];
  if (hoveredColor && hoveredColor.images?.length > 0) {
    imagesList = hoveredColor.images;
  } else if (product.featured && product.colors?.length > 0 && product.colors[0].images?.length > 0) {
    imagesList = product.colors[0].images;
  }

  if (imagesList.length === 0) {
    imagesList = ['/images/placeholder.jpg'];
  }

  useEffect(() => {
    let interval;
    if (isHovered && imagesList.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
      }, 2000);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, imagesList.length]);

  return (
    <Link 
      to={`/product/${product._id}`} 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card__inner">
        <div className="product-card__image-wrapper">
          {imagesList.map((imgSrc, index) => (
            <img
              key={`${imgSrc}-${index}`}
              src={imgSrc}
              alt={`${product.name} - View ${index + 1}`}
              className={`product-card__image ${index === currentImageIndex ? 'product-card__image--active' : 'product-card__image--inactive'}`}
              loading="lazy"
            />
          ))}
          <button
            className={`product-card__wishlist-btn ${wishlisted ? 'product-card__wishlist-btn--active' : ''}`}
            onClick={handleWishlistToggle}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlisted ? <FaHeart size={18} /> : <FiHeart size={18} />}
          </button>
          {product.featured && (
            <div className="product-card__badges">
              <span className="product-card__trending-badge">Trending ✨</span>
            </div>
          )}
        </div>

        <div className="product-card__content">
          <p className="product-card__category">{product.category}</p>
          <h3 className="product-card__name">{product.name}</h3>
          <div className="product-card__rating">
            <RatingStars rating={product.averageRating} count={product.numReviews} size={14} />
          </div>
          <div className="product-card__footer">
            <span className="product-card__price">₹{product.price?.toLocaleString('en-IN')}</span>
            <div className="product-card__colors">
              {product.colors?.slice(0, 3).map((color, i) => (
                <span
                  key={i}
                  className="product-card__color-dot"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  onMouseEnter={() => setHoveredColor(color)}
                  onMouseLeave={() => setHoveredColor(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
