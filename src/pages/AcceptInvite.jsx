import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const AcceptInvite = ({ onAuthSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  if (!token) {
    return (
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="auth-card">
          <h2 className="auth-title">Invalid Invite Link</h2>
          <p className="auth-sub">This invite link is missing a token. Please use the exact link from your invite email.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/team/accept-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to accept invite');

      onAuthSuccess(data);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      <div className="auth-card">
        <div className="auth-eyebrow">Team Invite</div>
        <h2 className="auth-title">Welcome to <span>Empire HomePath</span></h2>
        <p className="auth-sub">Set a password to activate your account and get started.</p>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && <div className="auth-error">{error}</div>}

          <div className="field-group">
            <label htmlFor="password" className="field-label">Create a Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input"
              placeholder="At least 8 characters"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="confirmPassword" className="field-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="field-input"
              placeholder="Re-enter your password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', marginTop: '4px' }}>
            {loading ? 'Setting up your account...' : <><CheckCircle size={18} /> Activate Account</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AcceptInvite;
