import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import './Footer.css';

const categories = [
  'T-Shirts', 'Shirts', 'Dresses', 'Jeans', 'Jackets', 'Hoodies', 'Ethnic Wear', 'Activewear',
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <h3 className="footer__brand-name">Vrishti</h3>
            <p className="footer__brand-desc">
              Like rain nourishes the earth, Vrishti refreshes your wardrobe with contemporary fashion rooted in tradition.
            </p>
            <div className="footer__social">
              <a href="https://www.instagram.com/scintillating_shruti_pandey" className="footer__social-link" aria-label="Instagram" target='_blank'><FiInstagram size={20} /></a>
              <a href="https://x.com/HareKrishna1729" className="footer__social-link" aria-label="Twitter" target='_blank'><FiTwitter size={20} /></a>
            </div>
          </div>

          {/* Categories */}
          <div className="footer__col">
            <h4 className="footer__heading">Categories</h4>
            <ul className="footer__col-list">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link to={`/store?category=${encodeURIComponent(cat)}`} className="footer__link">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__col-list">
              <li><Link to="/" className="footer__link" onClick={() => window.scrollTo(0, 0)}>Home</Link></li>
              <li><Link to="/store" className="footer__link" onClick={() => window.scrollTo(0, 0)}>Store</Link></li>
              <li><Link to="/cart" className="footer__link" onClick={() => window.scrollTo(0, 0)}>Cart</Link></li>
              <li><Link to="/wishlist" className="footer__link" onClick={() => window.scrollTo(0, 0)}>Wishlist</Link></li>
              <li><Link to="/orders" className="footer__link" onClick={() => window.scrollTo(0, 0)}>My Orders</Link></li>
              <li><Link to="/profile" className="footer__link" onClick={() => window.scrollTo(0, 0)}>Profile</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__heading">Contact</h4>
            <ul className="footer__col-list">
              <li className="footer__contact-item">
                <FiMapPin size={16} /><br />
                <span>Ayodhya, India</span>
              </li><br />
              <li className="footer__contact-item">
                <FiPhone size={16} /><br />
                <span><a href="tel:+917905567604">+91 79055 67604</a></span>
              </li><br />
              <li className="footer__contact-item">
                <FiMail size={16} /><br />
                <span><a href="mailto:shrutipandey369.1729@gmail.coms">shrutipandey369.1729@gmail.com</a></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__bottom-text">&copy; {new Date().getFullYear()} Vrishti. All rights reserved.</p>
          <p className="footer__bottom-text">Crafted with ❤️ by <a href="https://scintillating-shruti-pandey.github.io/Portfolio"><u>Shruti Pandey</u></a></p>
        </div>
      </div>
    </footer>
  );
}
