import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Loader from '../components/Loader';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google login failed. Please try again.');
      navigate('/login');
      return;
    }

    if (token) {
      localStorage.setItem('vrishti_token', token);
      // Fetch user data with the new token
      api.get('/auth/me').then((res) => {
        localStorage.setItem('vrishti_user', JSON.stringify(res.data.user));
        updateUser(res.data.user);
        toast.success('Welcome to Vrishti! ✨');
        navigate('/');
      }).catch(() => {
        toast.error('Login failed');
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="page-container">
      <Loader size="lg" text="Completing login..." />
    </div>
  );
}
