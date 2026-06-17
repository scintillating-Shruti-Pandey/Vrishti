import { FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import './RatingStars.css';

export default function RatingStars({ rating = 0, count, size = 16, interactive = false, onChange }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (interactive) {
      stars.push(
        <button
          key={i}
          className={`star-btn ${i <= rating ? 'star-btn--active' : ''}`}
          onClick={() => onChange && onChange(i)}
          type="button"
          aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
        >
          {i <= rating ? <FaStar size={size} /> : <FiStar size={size} />}
        </button>
      );
    } else {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} size={size} className="star--filled" />);
      } else if (i === Math.ceil(rating) && rating % 1 >= 0.3) {
        stars.push(<FaStarHalfAlt key={i} size={size} className="star--filled" />);
      } else {
        stars.push(<FiStar key={i} size={size} className="star--empty" />);
      }
    }
  }

  return (
    <div className="rating-stars">
      <div className="rating-stars__icons">{stars}</div>
      {count !== undefined && (
        <span className="rating-stars__count">({count})</span>
      )}
    </div>
  );
}
