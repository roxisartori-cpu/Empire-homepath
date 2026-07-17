import React, { useState } from 'react';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent duplicate/overlapping submissions
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      onAuthSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-eyebrow">Empire HomePath Pro</div>
        <h2 className="auth-title">
          {isLogin ? <>Welcome <span>Back</span></> : <>Create <span>Account</span></>}
        </h2>
        <p className="auth-sub">
          {isLogin
            ? 'Sign in to access verified homebuyer program data across all 62 NY counties.'
            : 'Start matching clients to programs in seconds.'}
        </p>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && <div className="auth-error">{error}</div>}

          <div className="field-group">
            <label htmlFor="email" className="field-label">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="pro@example.com"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="password" className="field-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', marginTop: '4px' }}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-switch">
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Sign up" : "Already  Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
