import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import RatingStars from '../components/RatingStars';
import Loader from '../components/Loader';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [bgPosition, setBgPosition] = useState('50% 50%');
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBgPosition(`${x}% ${y}%`);
  };

  const currentGallery = product?.colors?.find(c => c.name === selectedColor)?.images?.length > 0 
    ? product.colors.find(c => c.name === selectedColor).images 
    : (product?.images || []);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (currentGallery.length) {
      setActiveImage((prev) => (prev === 0 ? currentGallery.length - 1 : prev - 1));
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (currentGallery.length) {
      setActiveImage((prev) => (prev === currentGallery.length - 1 ? 0 : prev + 1));
    }
  };

  useEffect(() => {
    setActiveImage(0);
  }, [selectedColor]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productRes, reviewsRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/product/${id}`),
        ]);
        setProduct(productRes.data.product);
        setReviews(reviewsRes.data.reviews);
        if (productRes.data.product.sizes?.length) {
          setSelectedSize(productRes.data.product.sizes[0]);
        }
        if (productRes.data.product.colors?.length) {
          setSelectedColor(productRes.data.product.colors[0].name);
        }
      } catch {
        toast.error('Product not found');
        navigate('/store');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.info('Please login to add items to cart'); return; }
    if (!selectedSize) { toast.warning('Please select a size'); return; }
    if (!selectedColor) { toast.warning('Please select a color'); return; }
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity, selectedSize, selectedColor);
      toast.success('Added to cart! 🛒');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.info('Please login to use wishlist'); return; }
    try {
      const action = await toggleWishlist(product._id);
      toast.success(action === 'added' ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) { toast.warning('Please write a review'); return; }
    try {
      setSubmittingReview(true);
      const res = await api.post(`/reviews/product/${id}`, reviewForm);
      setReviews((prev) => [res.data.review, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted! ⭐');
      // Refresh product to update rating
      const prodRes = await api.get(`/products/${id}`);
      setProduct(prodRes.data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="page-container"><Loader size="lg" /></div>;
  if (!product) return null;

  const wishlisted = isInWishlist(product._id);
  const mainImage = currentGallery[activeImage] || currentGallery[0] || '/images/placeholder.jpg';
  const colorObj = product.colors?.find(c => c.name === selectedColor);
  const availableStock = colorObj && colorObj.stock !== undefined ? colorObj.stock : product.stock;

  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FS'];
  const sortedSizes = [...(product.sizes || [])].sort((a, b) => {
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

  return (
    <div className="product-detail page-container">
      <div className="container">
        <button className="product-detail__back btn btn-ghost" onClick={() => navigate(-1)}>
          <FiChevronLeft size={20} /> Back
        </button>

        <div className="product-detail__grid">
          {/* Images */}
          <div className="product-detail__images" style={{ position: 'relative' }}>
            {currentGallery.length > 1 && (
              <>
                <button className="product-detail__nav-btn product-detail__nav-btn--left" onClick={handlePrevImage}>
                  <FiChevronLeft size={24} />
                </button>
                <button className="product-detail__nav-btn product-detail__nav-btn--right" onClick={handleNextImage}>
                  <FiChevronRight size={24} />
                </button>
              </>
            )}
            <div 
              className="product-detail__main-image"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img src={mainImage} alt={product.name} style={{ opacity: isZoomed ? 0 : 1 }} />
              {isZoomed && (
                <div 
                  className="product-detail__zoomed-image"
                  style={{
                    backgroundImage: `url(${mainImage})`,
                    backgroundPosition: bgPosition
                  }}
                />
              )}
            </div>
            {currentGallery.length > 1 && (
              <div className="product-detail__thumbs">
                {currentGallery.map((img, i) => (
                  <button
                    key={i}
                    className={`product-detail__thumb ${i === activeImage ? 'product-detail__thumb--active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <span className="product-detail__category">{product.category} • {product.gender}</span>
            <h1 className="product-detail__name">{product.name}</h1>
            <div className="product-detail__rating">
              <RatingStars rating={product.averageRating} count={product.numReviews} size={18} />
            </div>
            <p className="product-detail__price">₹{product.price?.toLocaleString('en-IN')}</p>
            <p className="product-detail__desc">{product.description}</p>

            {/* Size Selection */}
            <div className="product-detail__option">
              <label>Size</label>
              <div className="product-detail__sizes">
                {sortedSizes.map((s) => (
                  <button
                    key={s}
                    className={`product-detail__size-btn ${selectedSize === s ? 'product-detail__size-btn--active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="product-detail__option">
              <label>Color — {selectedColor}</label>
              <div className="product-detail__colors">
                {product.colors?.map((c) => (
                  <button
                    key={c.name}
                    className={`product-detail__color-btn ${selectedColor === c.name ? 'product-detail__color-btn--active' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="product-detail__option">
              <label>Quantity</label>
              <div className="product-detail__quantity">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="product-detail__qty-btn"><FiMinus /></button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(availableStock, quantity + 1))} className="product-detail__qty-btn"><FiPlus /></button>
                <span className="product-detail__stock">{availableStock > 0 ? `${availableStock} in stock` : <span style={{ color: 'var(--color-error)' }}>Out of stock</span>}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="product-detail__actions">
              <button className="btn btn-primary btn-lg product-detail__add-btn" onClick={handleAddToCart} disabled={addingToCart || availableStock === 0}>
                <FiShoppingCart size={20} />
                {addingToCart ? 'Adding...' : availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className={`btn btn-secondary btn-lg product-detail__wish-btn ${wishlisted ? 'product-detail__wish-btn--active' : ''}`} onClick={handleWishlist}>
                {wishlisted ? <FaHeart size={20} /> : <FiHeart size={20} />}
              </button>
            </div>

            {/* Meta */}
            <div className="product-detail__meta">
              <p><strong>Material:</strong> {product.material}</p>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Age Group:</strong> {Array.isArray(product.ageGroup) ? product.ageGroup.join(', ') : product.ageGroup}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="product-detail__reviews">
          <h2 className="section-title">Ratings & Reviews</h2>

          {/* Review Form */}
          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="review-form card">
              <h3>Write a Review</h3>
              <p className="review-form__note">You can only review products you've purchased</p>
              <div className="review-form__rating">
                <label>Your Rating</label>
                <RatingStars rating={reviewForm.rating} interactive onChange={(r) => setReviewForm({ ...reviewForm, rating: r })} size={24} />
              </div>
              <input
                type="text"
                className="input-field"
                placeholder="Review title (optional)"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
              />
              <textarea
                className="input-field review-form__textarea"
                placeholder="Share your experience with this product..."
                rows={4}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              />
              <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Review List */}
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="reviews-list__empty">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="review-card card">
                  <div className="review-card__header">
                    <div className="review-card__user">
                      <div className="review-card__avatar">
                        {review.user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="review-card__name">{review.user?.name}</p>
                        <RatingStars rating={review.rating} size={14} />
                      </div>
                    </div>
                    <span className="review-card__date">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {review.title && <h4 className="review-card__title">{review.title}</h4>}
                  <p className="review-card__comment">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
