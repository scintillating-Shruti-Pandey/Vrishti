import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiKey } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', adminKey: '' });
  const [showAdmin, setShowAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters'); return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.adminKey);
      toast.success('Welcome to Vrishti! ✨ ₹10,000 added to your wallet!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in">
        <h1 className="auth-card__logo">Vrishti</h1>
        <p className="auth-card__title">Create your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="signup-name"><FiUser size={14} style={{display:'inline',verticalAlign:'middle',marginRight:6}} />Full Name</label>
            <input id="signup-name" name="name" className="input-field" placeholder="Your Full Name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="signup-email"><FiMail size={14} style={{display:'inline',verticalAlign:'middle',marginRight:6}} />Email</label>
            <input id="signup-email" name="email" type="email" className="input-field" placeholder="email@abc.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="signup-password"><FiLock size={14} style={{display:'inline',verticalAlign:'middle',marginRight:6}} />Password</label>
            <input id="signup-password" name="password" type="password" className="input-field" placeholder="Min 8 chars, 1 number, 1 special" value={form.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="signup-confirm"><FiLock size={14} style={{display:'inline',verticalAlign:'middle',marginRight:6}} />Confirm Password</label>
            <input id="signup-confirm" name="confirmPassword" type="password" className="input-field" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required />
          </div>

          {showAdmin ? (
            <div className="input-group">
              <label htmlFor="admin-key"><FiKey size={14} style={{display:'inline',verticalAlign:'middle',marginRight:6}} />Admin Key</label>
              <input id="admin-key" name="adminKey" className="input-field" placeholder="Enter admin secret key" value={form.adminKey} onChange={handleChange} />
            </div>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAdmin(true)} style={{ alignSelf: 'flex-start' }}>
              Register as Admin?
            </button>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <a href="/api/auth/google" className="auth-google-btn">
          <FcGoogle size={20} /> Continue with Google
        </a>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
