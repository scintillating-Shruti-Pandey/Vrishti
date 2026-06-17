import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import './Pages.css';

export default function WalletPage() {
  const { user, updateUser } = useAuth();
  const [wallet, setWallet] = useState({ balance: 0, history: [] });
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get('/wallet/balance');
        setWallet(res.data.wallet);
      } catch (error) {
        console.error('Failed to fetch wallet:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const handleAddFunds = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) { toast.warning('Enter a valid amount'); return; }
    if (num > 100000) { toast.warning('Maximum ₹1,00,000 per transaction'); return; }
    setAdding(true);
    try {
      const res = await api.post('/wallet/add-funds', { amount: num });
      setWallet(res.data.wallet);
      updateUser({ wallet: res.data.wallet.balance });
      setAmount('');
      toast.success(`₹${num.toLocaleString('en-IN')} added to wallet! 💰`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add funds');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="page-container"><Loader size="lg" /></div>;

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 className="section-title">My Wallet</h1>
        <p className="section-subtitle" style={{ marginBottom: 'var(--space-8)' }}>Manage your Vrishti wallet</p>

        <div className="wallet-card animate-fade-in-up">
          <p className="wallet-card__label">Available Balance</p>
          <p className="wallet-card__balance">₹{wallet.balance.toLocaleString('en-IN')}</p>
        </div>

        <form onSubmit={handleAddFunds} className="wallet-add-form">
          <input
            type="number"
            className="input-field"
            placeholder="Enter amount to add (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            max="100000"
          />
          <button type="submit" className="btn btn-primary" disabled={adding}>
            <FiPlus size={18} /> {adding ? 'Adding...' : 'Add Funds'}
          </button>
        </form>

        <div className="wallet-history">
          <h3>Transaction History</h3>
          {wallet.history.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: 'var(--space-8) 0', textAlign: 'center' }}>No transactions yet</p>
          ) : (
            wallet.history.map((txn, i) => (
              <div key={i} className="wallet-history__item">
                <div>
                  <p className="wallet-history__desc">{txn.description}</p>
                  <p className="wallet-history__date">
                    {new Date(txn.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className={`wallet-history__amount wallet-history__amount--${txn.type}`}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
