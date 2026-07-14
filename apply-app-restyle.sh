#!/bin/bash
set -e

if [ ! -f "package.json" ]; then
  echo "Error: run this from the root of your Empire-homepath repo (where package.json lives)."
  exit 1
fi

mkdir -p src/styles src/components

echo "Writing src/styles/app.css..."
cat > src/styles/app.css << 'EOF_APPCSS'
/* ============================================================
   Empire HomePath — Subscriber App (/app) design system
   Mirrors the token set and component patterns already proven
   out on empirehomepath-demo.html, so /app matches the rest
   of the site instead of the generic light/blue theme.
   ============================================================ */

:root{
  --ink:#0A1628;--ink-deep:#060E1C;--ink-mid:#102038;--ink-lift:#16284A;--ink-hover:#1C3158;
  --gold:#C9A84C;--gold-warm:#DDB85C;--gold-dim:rgba(201,168,76,0.12);
  --white:#FFFFFF;--body-c:rgba(255,255,255,0.65);--muted:rgba(255,255,255,0.35);
  --border:rgba(201,168,76,0.16);--border-mid:rgba(201,168,76,0.28);
  --success:#4ADE80;--danger:#FF5C5C;--warning:#FBB924;
}

/* ---------- App shell ---------- */
.app-shell{
  min-height:100vh;
  background:var(--ink);
  color:var(--white);
  font-family:'Inter',sans-serif;
  -webkit-font-smoothing:antialiased;
}

/* ---------- Nav ---------- */
.app-nav{
  position:sticky;top:0;z-index:100;
  height:64px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 24px;
  background:rgba(6,14,28,0.98);
  backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
}
.app-nav-logo{
  display:flex;align-items:center;gap:8px;
  font-size:18px;font-weight:700;color:var(--white);
  background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;
}
.app-nav-logo span{color:var(--gold);}
.app-nav-links{display:flex;align-items:center;gap:12px;}
.app-nav-btn{
  display:flex;align-items:center;gap:8px;
  font-size:12px;font-weight:600;letter-spacing:0.04em;
  color:var(--gold);background:var(--gold-dim);
  border:1px solid var(--border-mid);
  padding:9px 16px;border-radius:6px;cursor:pointer;
  font-family:'Inter',sans-serif;transition:all 0.2s;
}
.app-nav-btn:hover{border-color:var(--gold);}
.app-nav-btn.is-active{background:var(--gold);color:var(--ink-deep);}
.app-nav-link{
  font-size:12px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;
  color:var(--body-c);text-decoration:none;transition:color 0.2s;
}
.app-nav-link:hover{color:var(--gold);}
.app-nav-user{
  display:flex;align-items:center;gap:14px;
  padding-left:16px;margin-left:6px;border-left:1px solid var(--border);
}
.app-nav-user-tier{
  font-family:'DM Mono',monospace;font-size:10px;font-weight:500;
  letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);
  display:block;text-align:right;
}
.app-nav-user-email{
  font-size:12px;color:var(--muted);display:block;text-align:right;
  max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.app-nav-logout{
  display:flex;align-items:center;justify-content:center;
  width:36px;height:36px;border-radius:50%;
  color:var(--muted);background:none;border:none;cursor:pointer;transition:all 0.2s;
}
.app-nav-logout:hover{color:var(--danger);background:rgba(255,92,92,0.1);}
.app-nav-burger{
  display:none;background:none;border:none;color:var(--body-c);cursor:pointer;padding:8px;
}
.app-mobile-menu{
  background:var(--ink-deep);border-bottom:1px solid var(--border);
  padding:20px;display:flex;flex-direction:column;gap:16px;
}
.app-mobile-link{
  font-size:15px;font-weight:600;color:var(--white);background:none;border:none;
  text-align:left;display:flex;align-items:center;gap:10px;cursor:pointer;text-decoration:none;
}
@media(max-width:860px){
  .app-nav-links{display:none;}
  .app-nav-burger{display:flex;}
}

/* ---------- Auth ---------- */
.auth-wrap{
  min-height:calc(100vh - 64px);
  display:flex;align-items:center;justify-content:center;
  padding:40px 20px;
}
.auth-card{
  width:100%;max-width:420px;
  background:var(--ink-mid);
  border:1px solid var(--border-mid);
  border-radius:10px;
  padding:40px 36px;
  box-shadow:0 20px 60px rgba(0,0,0,0.35);
}
.auth-eyebrow{
  font-family:'DM Mono',monospace;font-size:10px;font-weight:500;
  letter-spacing:0.18em;text-transform:uppercase;color:var(--gold);
  opacity:0.85;margin-bottom:12px;display:flex;align-items:center;gap:10px;
}
.auth-eyebrow::before{content:'';display:block;width:20px;height:1px;background:var(--gold);}
.auth-title{
  font-size:26px;font-weight:800;letter-spacing:-0.01em;color:var(--white);
  margin-bottom:8px;
}
.auth-title span{color:var(--gold);}
.auth-sub{font-size:13px;color:var(--body-c);margin-bottom:28px;line-height:1.6;}
.auth-error{
  background:rgba(255,92,92,0.1);border:1px solid rgba(255,92,92,0.3);
  color:var(--danger);font-size:13px;padding:12px 14px;border-radius:6px;margin-bottom:20px;
}
.auth-switch{
  margin-top:22px;text-align:center;font-size:13px;color:var(--muted);
}
.auth-switch button{
  color:var(--gold);background:none;border:none;cursor:pointer;font-weight:600;
  font-size:13px;font-family:'Inter',sans-serif;
}
.auth-switch button:hover{color:var(--gold-warm);text-decoration:underline;}

/* ---------- Form fields (shared: Auth + Eligibility) ---------- */
.field-group{display:flex;flex-direction:column;gap:6px;}
.field-label{
  font-family:'DM Mono',monospace;font-size:10px;font-weight:500;
  letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);opacity:0.85;
}
.field-input, .field-select{
  width:100%;background:var(--ink-lift);
  border:1px solid var(--border-mid);color:var(--white);
  padding:13px 16px;border-radius:6px;font-size:14px;
  font-family:'Inter',sans-serif;transition:border-color 0.2s,box-shadow 0.2s;
}
.field-input::placeholder{color:var(--muted);}
.field-input:focus, .field-select:focus{
  outline:none;border-color:var(--gold);box-shadow:0 0 0 3px var(--gold-dim);
}
.field-select{appearance:none;-webkit-appearance:none;cursor:pointer;}
.field-select option{background:var(--ink-mid);}
.select-wrap{position:relative;}
.select-wrap::after{
  content:'▾';position:absolute;right:14px;top:50%;transform:translateY(-50%);
  color:var(--gold);font-size:13px;pointer-events:none;
}
.field-hint{font-size:11px;color:var(--muted);display:flex;align-items:center;gap:6px;margin-top:2px;}
.field-prefix-wrap{position:relative;}
.field-prefix{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);font-weight:500;font-size:14px;}
.field-prefix-wrap .field-input{padding-left:28px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
@media(max-width:640px){.form-row{grid-template-columns:1fr;}}

/* Pill toggle buttons (property type, yes/no) */
.pill-toggle{
  padding:10px 16px;border-radius:6px;border:1px solid var(--border-mid);
  background:var(--ink-lift);color:var(--body-c);font-size:13px;font-weight:500;
  cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;
}
.pill-toggle:hover{border-color:var(--gold);color:var(--white);}
.pill-toggle.is-active{
  background:var(--gold-dim);border-color:var(--gold);color:var(--gold);font-weight:700;
}

/* Custom checkbox row */
.check-row{display:flex;align-items:center;gap:12px;cursor:pointer;}
.check-box{
  width:22px;height:22px;border-radius:5px;border:1.5px solid var(--border-mid);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;
}
.check-row:hover .check-box{border-color:var(--gold);}
.check-box.is-checked{background:var(--gold);border-color:var(--gold);color:var(--ink-deep);}
.check-label{font-size:13px;color:var(--body-c);}

/* ---------- Cards ---------- */
.card-dark{
  background:var(--ink-mid);border:1px solid var(--border);
  border-radius:10px;
}
.card-dark-pad{padding:28px;}
@media(max-width:640px){.card-dark-pad{padding:22px 18px;}}

/* ---------- Buttons ---------- */
.btn-gold{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  background:var(--gold);color:var(--ink-deep);
  font-size:13px;font-weight:700;letter-spacing:0.04em;
  padding:14px 28px;border-radius:6px;border:none;cursor:pointer;
  font-family:'Inter',sans-serif;transition:all 0.2s;
}
.btn-gold:hover:not(:disabled){background:var(--gold-warm);transform:translateY(-1px);}
.btn-gold:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
.btn-gold-outline{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  background:none;color:var(--gold);border:1px solid var(--border-mid);
  font-size:13px;font-weight:700;letter-spacing:0.04em;
  padding:14px 28px;border-radius:6px;cursor:pointer;
  font-family:'Inter',sans-serif;transition:all 0.2s;
}
.btn-gold-outline:hover{border-color:var(--gold);background:var(--gold-dim);}
.btn-ghost-dark{
  background:none;border:1px solid var(--border-mid);color:var(--body-c);
  font-size:12px;font-weight:600;letter-spacing:0.04em;
  padding:9px 18px;border-radius:6px;cursor:pointer;font-family:'Inter',sans-serif;
  transition:all 0.2s;
}
.btn-ghost-dark:hover{color:var(--white);border-color:var(--gold);}

/* ---------- Plans / paywall ---------- */
.plan-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:900px;margin:0 auto;}
@media(max-width:760px){.plan-grid{grid-template-columns:1fr;}}
.plan-card{
  position:relative;background:var(--ink-mid);border:1px solid var(--border);
  border-radius:10px;padding:32px;display:flex;flex-direction:column;
}
.plan-card.is-featured{border-color:var(--gold);background:var(--ink-lift);}
.plan-card.is-featured::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;border-radius:10px 10px 0 0;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
}
.plan-badge{
  position:absolute;top:-13px;left:50%;transform:translateX(-50%);
  background:var(--gold);color:var(--ink-deep);font-size:10px;font-weight:700;
  letter-spacing:0.1em;text-transform:uppercase;padding:5px 16px;border-radius:20px;white-space:nowrap;
}
.plan-tier{font-size:20px;font-weight:800;color:var(--white);margin-bottom:8px;}
.plan-price-row{display:flex;align-items:baseline;gap:4px;margin-bottom:6px;}
.plan-price{font-size:40px;font-weight:900;color:var(--white);letter-spacing:-0.02em;line-height:1;}
.plan-period{font-size:13px;color:var(--muted);}
.plan-trial{color:var(--gold);font-weight:600;font-size:13px;font-style:italic;margin-bottom:20px;}
.plan-feats{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:28px;flex:1;}
.plan-feats li{font-size:13px;color:var(--body-c);display:flex;gap:10px;align-items:flex-start;}
.plan-feats .ck{color:var(--gold);font-weight:700;flex-shrink:0;}

/* ---------- Results ---------- */
.results-header{
  display:flex;flex-direction:column;gap:4px;margin-bottom:24px;
}
@media(min-width:640px){
  .results-header{flex-direction:row;align-items:center;justify-content:space-between;}
}
.results-title{font-size:22px;font-weight:700;color:var(--white);}
.results-count{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.06em;color:var(--muted);}

.match-badge{
  display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;
  padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.04em;
}
.match-badge.strong{background:rgba(74,222,128,0.12);color:var(--success);border:1px solid rgba(74,222,128,0.25);}
.match-badge.good{background:var(--gold-dim);color:var(--gold);border:1px solid var(--border-mid);}
.match-badge.maybe{background:rgba(255,255,255,0.06);color:var(--muted);border:1px solid var(--border);}
.category-pill{
  font-family:'DM Mono',monospace;font-size:9px;font-weight:500;letter-spacing:0.08em;
  text-transform:uppercase;color:var(--gold);opacity:0.7;
  background:var(--ink-lift);padding:3px 9px;border-radius:5px;
}

.prog-card{
  background:var(--ink-mid);border:1px solid var(--border);border-radius:10px;
  padding:24px;transition:all 0.2s;position:relative;overflow:hidden;
}
.prog-card::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gold);
  transform:scaleY(0);transform-origin:top;transition:transform 0.25s;
}
.prog-card:hover{background:var(--ink-lift);border-color:var(--border-mid);}
.prog-card:hover::before{transform:scaleY(1);}
.prog-icon{
  font-size:26px;padding:10px;background:var(--ink-lift);border-radius:8px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.prog-name{font-size:16px;font-weight:700;color:var(--white);}
.prog-desc{font-size:13px;color:var(--body-c);line-height:1.65;}
.prog-stat-label{
  font-family:'DM Mono',monospace;font-size:9px;font-weight:500;letter-spacing:0.1em;
  text-transform:uppercase;color:var(--muted);margin-bottom:3px;
}
.prog-stat-value{font-size:13px;font-weight:600;color:var(--white);}
.prog-stat-value.gold{color:var(--gold);}
.prog-stat-value.green{color:var(--success);}
.prog-footer{border-top:1px solid var(--border);padding-top:16px;}
.prog-link{
  color:var(--gold);font-weight:600;font-size:12px;display:inline-flex;align-items:center;
  gap:5px;text-decoration:none;transition:color 0.2s;
}
.prog-link:hover{color:var(--gold-warm);}
.verify-btn{
  display:inline-flex;align-items:center;gap:6px;color:var(--muted);
  background:none;border:1px solid transparent;padding:6px 12px;border-radius:6px;
  font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;
}
.verify-btn:hover{color:var(--gold);border-color:var(--border-mid);}
.verify-pending{color:var(--gold);font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;}
.verify-verified{
  color:var(--success);font-size:12px;font-weight:700;background:rgba(74,222,128,0.1);
  padding:4px 10px;border-radius:6px;display:inline-flex;align-items:center;gap:6px;
}
.verify-notlive{
  color:var(--warning);font-size:12px;font-weight:600;background:rgba(251,185,36,0.1);
  padding:4px 10px;border-radius:6px;display:inline-flex;align-items:center;gap:6px;
}
.verify-source{font-size:10px;color:var(--muted);text-decoration:underline;}
.btn-apply{
  background:var(--gold);color:var(--ink-deep);font-size:13px;font-weight:700;
  padding:10px 22px;border-radius:6px;text-decoration:none;transition:all 0.2s;
}
.btn-apply:hover{background:var(--gold-warm);}
.btn-specialist{
  color:var(--gold);font-weight:600;font-size:12px;background:none;border:none;
  cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:6px 10px;
  border-radius:6px;transition:all 0.2s;font-family:'Inter',sans-serif;
}
.btn-specialist:hover{background:var(--gold-dim);}

.no-results{
  text-align:center;padding:60px 24px;background:var(--ink-mid);
  border:1px solid var(--border);border-radius:10px;
}
.no-results h2{font-size:20px;font-weight:700;color:var(--white);margin-bottom:8px;}
.no-results p{font-size:14px;color:var(--body-c);}

/* ---------- Spinner ---------- */
.spinner-gold{
  width:40px;height:40px;border:3px solid var(--border-mid);
  border-top-color:var(--gold);border-radius:50%;animation:app-spin 0.8s linear infinite;
}
@keyframes app-spin{to{transform:rotate(360deg);}}
EOF_APPCSS

echo "Writing src/components/Auth.jsx..."
cat > src/components/Auth.jsx << 'EOF_AUTH'
import React, { useState } from 'react';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
EOF_AUTH

echo "Writing src/components/NavBar.jsx..."
cat > src/components/NavBar.jsx << 'EOF_NAVBAR'
import React, { useState } from 'react';
import { Menu, X, LogOut, User, Palette, LayoutDashboard } from 'lucide-react';

const NavBar = ({ user, onLogout, onViewChange, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isSubscribed = user?.role === 'admin' || user?.subscription_status === 'active';

  return (
    <nav className="app-nav">
      <button onClick={() => onViewChange('app')} className="app-nav-logo">
        Empire <span>HomePath</span> Pro
      </button>

      {/* Desktop nav */}
      <div className="app-nav-links">
        {isSubscribed && (
          <button
            onClick={() => onViewChange(currentView === 'dashboard' ? 'app' : 'dashboard')}
            className={`app-nav-btn ${currentView === 'dashboard' ? 'is-active' : ''}`}
          >
            <LayoutDashboard size={14} /> {currentView === 'dashboard' ? 'Go to Search' : 'Dashboard'}
          </button>
        )}
        {user?.role === 'admin' && (
          <button
            onClick={() => onViewChange(currentView === 'admin' ? 'app' : 'admin')}
            className={`app-nav-btn ${currentView === 'admin' ? 'is-active' : ''}`}
          >
            {currentView === 'admin' ? 'Go to App' : 'Admin Panel'}
          </button>
        )}
        {user?.plan === 'white-label' && (
          <button
            onClick={() => onViewChange(currentView === 'branding' ? 'app' : 'branding')}
            className={`app-nav-btn ${currentView === 'branding' ? 'is-active' : ''}`}
          >
            <Palette size={14} /> Branding
          </button>
        )}
        <a href="#glossary" className="app-nav-link">Glossary</a>
        <a href="#checklist" className="app-nav-link">Checklist</a>

        {user && (
          <div className="app-nav-user">
            <div>
              <span className="app-nav-user-tier">{user.plan} Tier</span>
              <span className="app-nav-user-email">{user.email}</span>
            </div>
            <button onClick={onLogout} className="app-nav-logout" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile hamburger */}
      <button className="app-nav-burger" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="app-mobile-menu" style={{ position: 'absolute', top: '64px', left: 0, right: 0 }}>
          {isSubscribed && (
            <button
              onClick={() => { onViewChange('dashboard'); setIsMenuOpen(false); }}
              className="app-mobile-link"
            >
              <LayoutDashboard size={18} /> Professional Dashboard
            </button>
          )}
          <a href="#glossary" className="app-mobile-link" onClick={() => setIsMenuOpen(false)}>Glossary</a>
          <a href="#checklist" className="app-mobile-link" onClick={() => setIsMenuOpen(false)}>Checklist</a>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', marginTop: '4px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--gold-dim)', border: '1px solid var(--border-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                  <User size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)' }}>{user.email}</p>
                  <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{user.plan} Tier</p>
                </div>
              </div>
              <button onClick={onLogout} className="btn-ghost-dark" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogOut size={16} /> Exit
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
EOF_NAVBAR

echo "Writing src/components/SubscriptionPaywall.jsx..."
cat > src/components/SubscriptionPaywall.jsx << 'EOF_PAYWALL'
import React, { useState } from 'react';

const SubscriptionPaywall = ({ user, onSubscribeSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (priceId) => {
    setLoading(true);
    setError('');
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initiate subscription');

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="auth-eyebrow" style={{ justifyContent: 'center' }}>Professional Eligibility Engine</div>
        <h2 style={{ fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.02em', marginBottom: '14px' }}>
          Unlock Full <span style={{ color: 'var(--gold)' }}>Program Matching</span>
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--body-c)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
          Unlock instant matching for 60+ assistance programs across all 62 NY counties.
          Qualify more buyers in seconds.
        </p>
      </div>

      {error && (
        <div className="auth-error" style={{ maxWidth: '560px', margin: '0 auto 32px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div className="plan-grid">
        {/* Individual Tier */}
        <div className="plan-card">
          <div className="plan-tier">Individual Tier</div>
          <div className="plan-price-row">
            <span className="plan-price">$150</span>
            <span className="plan-period">/mo</span>
          </div>
          <p className="plan-trial">7-day free trial included</p>
          <ul className="plan-feats">
            {['62-county matching engine', 'Unlimited searches', 'Client PDF reports', 'Real-time program updates'].map((feat) => (
              <li key={feat}><span className="ck">✓</span> {feat}</li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe('price_1TpszdCjCXhGzH7HxZDe5vKw')}
            disabled={loading}
            className="btn-gold-outline"
            style={{ width: '100%' }}
          >
            Start 7-Day Free Trial
          </button>
        </div>

        {/* Professional Tier */}
        <div className="plan-card is-featured">
          <div className="plan-badge">Most Popular</div>
          <div className="plan-tier">Professional Tier</div>
          <div className="plan-price-row">
            <span className="plan-price">$375</span>
            <span className="plan-period">/mo</span>
          </div>
          <p className="plan-trial">Everything in Individual plus:</p>
          <ul className="plan-feats">
            {['Custom logo & colors', 'Lead generation widgets', 'Branded client portals', 'Priority support'].map((feat) => (
              <li key={feat}><span className="ck">✓</span> {feat}</li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe('price_PROFESSIONAL_ID_HERE')}
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%' }}
          >
            Go Professional
          </button>
        </div>
      </div>

      <p style={{ marginTop: '40px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
        Secure billing with Stripe. Cancel anytime in your dashboard.
      </p>
    </div>
  );
};

export default SubscriptionPaywall;
EOF_PAYWALL

echo "Writing src/components/EligibilityForm.jsx..."
cat > src/components/EligibilityForm.jsx << 'EOF_ELIGFORM'
import React from 'react';
import { NY_COUNTIES } from '../counties';

const EligibilityForm = ({ formData, handleInputChange, handleSubmit, isSearching }) => {
  return (
    <section id="form" style={{ padding: '0 20px 48px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div className="card-dark card-dark-pad">
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--white)', marginBottom: '4px' }}>Tell us about you</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '28px' }}>We'll match you with programs you may qualify for.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* County */}
            <div className="form-row">
              <div className="field-group">
                <label htmlFor="county" className="field-label">County you're looking in</label>
                <div className="select-wrap">
                  <select
                    id="county"
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    className="field-select"
                    required
                  >
                    <option value="">Select a county...</option>
                    {NY_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="field-group">
                <label htmlFor="city" className="field-label">City / Town (optional)</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Buffalo, Albany"
                  className="field-input"
                />
              </div>
            </div>

            {/* Household income */}
            <div className="field-group">
              <label htmlFor="income" className="field-label">Your household income</label>
              <div className="field-prefix-wrap">
                <span className="field-prefix">$</span>
                <input
                  type="number"
                  id="income"
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  placeholder="Your household income before taxes"
                  className="field-input"
                />
              </div>
              <p className="field-hint">
                <span title="Include all earners in your household before taxes">💡</span>
                Include all earners in your household before taxes
              </p>
            </div>

            {/* Purchase price */}
            <div className="field-group">
              <label htmlFor="purchasePrice" className="field-label">Price of the home you're looking at</label>
              <div className="field-prefix-wrap">
                <span className="field-prefix">$</span>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  placeholder="Approximate price"
                  className="field-input"
                />
              </div>
            </div>

            {/* Property type */}
            <div className="field-group">
              <label className="field-label">Type of home</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { label: '🏠 Single-family home', value: 'Single Family' },
                  { label: '🏢 Condo / Co-op', value: 'Condo/Co-op' },
                  { label: '🏘️ Townhouse', value: 'Townhouse' },
                  { label: '🏡 Multi-family (2-4 units)', value: '2-4 Unit' }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'propertyType', value: type.value } })}
                    className={`pill-toggle ${formData.propertyType === type.value ? 'is-active' : ''}`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* First-time buyer */}
            <div className="field-group">
              <label className="field-label">Is this your first time buying a home?</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'isFirstTimeBuyer', value: opt.value } })}
                    className={`pill-toggle ${formData.isFirstTimeBuyer === opt.value ? 'is-active' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Veteran status */}
            <div className="field-group">
              <label className="field-label">Have you served in the military?</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'isVeteran', value: opt.value } })}
                    className={`pill-toggle ${formData.isVeteran === opt.value ? 'is-active' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Interests */}
            <div className="field-group" style={{ paddingTop: '4px' }}>
              <label className="field-label" style={{ marginBottom: '6px' }}>Optional: Are you interested in any of these?</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label className="check-row">
                  <input
                    type="checkbox"
                    name="isInterestedInRenovation"
                    checked={formData.isInterestedInRenovation}
                    onChange={handleInputChange}
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                  />
                  <div className={`check-box ${formData.isInterestedInRenovation ? 'is-checked' : ''}`}>
                    {formData.isInterestedInRenovation && '✓'}
                  </div>
                  <span className="check-label">Fixing up a home that needs repairs (Renovation)</span>
                </label>

                <label className="check-row">
                  <input
                    type="checkbox"
                    name="isInterestedInEnergy"
                    checked={formData.isInterestedInEnergy}
                    onChange={handleInputChange}
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                  />
                  <div className={`check-box ${formData.isInterestedInEnergy ? 'is-checked' : ''}`}>
                    {formData.isInterestedInEnergy && '✓'}
                  </div>
                  <span className="check-label">Energy-saving upgrades (Solar, Insulation, etc.)</span>
                </label>

                <label className="check-row">
                  <input
                    type="checkbox"
                    name="isInterestedInAccessibility"
                    checked={formData.isInterestedInAccessibility}
                    onChange={handleInputChange}
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                  />
                  <div className={`check-box ${formData.isInterestedInAccessibility ? 'is-checked' : ''}`}>
                    {formData.isInterestedInAccessibility && '✓'}
                  </div>
                  <span className="check-label">Modifications for disabilities (Accessibility)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="btn-gold"
              style={{ width: '100%' }}
            >
              {isSearching ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(10,22,40,0.3)', borderTopColor: 'var(--ink-deep)', borderRadius: '50%', animation: 'app-spin 0.8s linear infinite' }}></div>
                  Searching...
                </>
              ) : (
                'Find My Programs →'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EligibilityForm;
EOF_ELIGFORM

echo "Writing src/components/ResultsList.jsx..."
cat > src/components/ResultsList.jsx << 'EOF_RESULTS'
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, RefreshCw, CheckCircle, AlertCircle, Building2, FileText } from 'lucide-react';

const ResultsList = ({ programs, onSaveClick, verificationStates = {}, onVerifyLive, onLenderClick, isAdminView = false, formData = {}, user = null }) => {
  const navigate = useNavigate();

  if (programs.length === 0) {
    return (
      <section id="results" style={{ padding: '0 20px 64px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div className="no-results">
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>🔍</div>
            <h2>No perfect matches found</h2>
            <p>Try adjusting your info. Some programs have very specific requirements.</p>
          </div>
        </div>
      </section>
    );
  }

  const handlePrintClick = () => {
    const formattedResults = programs.map(p => ({
      id: p.program_id || p.id,
      name: p.program_name,
      description: p.description,
      matchScore: p.matchStrength,
      incomeLimit: typeof p.income_limits === 'string' ? p.income_limits : 'Varies',
      priceLimit: typeof p.purchase_price_limits === 'string' ? p.purchase_price_limits : 'Varies',
      url: p.official_url
    }));

    navigate('/report', {
      state: {
        results: formattedResults,
        formData,
        user
      }
    });
  };

  const badgeClass = {
    'Strong': 'strong',
    'Good': 'good',
    'Maybe': 'maybe'
  };

  return (
    <section id="results" style={{ padding: '0 20px 64px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div className="results-header">
          <div>
            <h2 className="results-title">We found programs that match your info</h2>
            <span className="results-count">Showing {programs.length} programs</span>
          </div>
          <button onClick={handlePrintClick} className="btn-gold-outline" style={{ padding: '10px 20px', fontSize: '12px' }}>
            <FileText size={15} /> Generate PDF Report
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {programs.map((program, idx) => {
            const programId = program.program_id || program.id || `prog-${idx}`;
            return (
              <div key={idx} className="prog-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' }}>
                  <div className="prog-icon">
                    {program.program_name.includes('Dream') ? '🏡' :
                     program.program_name.includes('Down Payment') ? '💵' :
                     program.program_name.includes('Remodel') ? '🔨' :
                     program.program_name.includes('Grant') ? '🏠' : '🏘️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span className={`match-badge ${badgeClass[program.matchStrength]}`}>
                        ★ {program.matchStrength} Match
                      </span>
                      <span className="category-pill">{program.category || 'Program'}</span>
                    </div>
                    <h3 className="prog-name">{program.program_name}</h3>
                  </div>
                </div>

                <p className="prog-desc" style={{ marginBottom: '20px' }}>{program.description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <p className="prog-stat-label">Yearly income limit</p>
                    <p className={`prog-stat-value ${verificationStates[programId]?.resultData?.verified_income_limit ? 'green' : ''}`}>
                      {verificationStates[programId]?.resultData?.verified_income_limit ? (
                        <>${verificationStates[programId].resultData.verified_income_limit.toLocaleString()}*</>
                      ) : (
                        typeof program.income_limits === 'string' ? program.income_limits : 'Varies by county'
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="prog-stat-label">Home price limit</p>
                    <p className={`prog-stat-value ${verificationStates[programId]?.resultData?.verified_price_cap ? 'green' : ''}`}>
                      {verificationStates[programId]?.resultData?.verified_price_cap ? (
                        <>${verificationStates[programId].resultData.verified_price_cap.toLocaleString()}*</>
                      ) : (
                        typeof program.purchase_price_limits === 'string' ? program.purchase_price_limits : 'Varies by county'
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="prog-stat-label">Counties served</p>
                    <p className="prog-stat-value">{program.counties_served}</p>
                  </div>
                  <div>
                    <p className="prog-stat-label">Home type</p>
                    <p className="prog-stat-value">{program.property_type_eligibility}</p>
                  </div>
                </div>

                <div className="prog-footer" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                    <a href={program.official_url} target="_blank" rel="noopener noreferrer" className="prog-link">
                      Official Website <ExternalLink size={13} />
                    </a>

                    <div>
                      {verificationStates[programId] ? (
                        verificationStates[programId].status === 'pending' ? (
                          <span className="verify-pending"><RefreshCw size={13} className="animate-spin" /> Verifying...</span>
                        ) : verificationStates[programId].status === 'verified' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span className="verify-verified"><CheckCircle size={13} /> Live Verified</span>
                            <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                              Checked {verificationStates[programId].resultData?.timestamp || 'Just now'}
                            </span>
                            {verificationStates[programId].resultData?.source_url && (
                              <a href={verificationStates[programId].resultData.source_url} target="_blank" rel="noopener noreferrer" className="verify-source">
                                View Source
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="verify-notlive"><AlertCircle size={13} /> Not Eligible (Live)</span>
                        )
                      ) : (
                        <button onClick={() => onVerifyLive(programId)} className="verify-btn">
                          <RefreshCw size={13} /> Verify Live Now
                        </button>
                      )}
                    </div>

                    <button onClick={() => onLenderClick(program.program_name)} className="btn-specialist">
                      <Building2 size={13} /> Talk to a Specialist
                    </button>
                  </div>

                  <a href={program.official_url} target="_blank" rel="noopener noreferrer" className="btn-apply">
                    Apply for This
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        {!isAdminView && (
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px', width: '100%' }}>
              <button onClick={handlePrintClick} className="btn-gold" style={{ flex: '1 1 220px' }}>
                <FileText size={18} /> Generate PDF Report
              </button>
              <button onClick={onSaveClick} className="btn-gold-outline" style={{ flex: '1 1 220px' }}>
                💾 Save My Results
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultsList;
EOF_RESULTS

echo "Patching src/App.jsx (3 targeted edits, not a full overwrite)..."
python3 << 'EOF_PYPATCH'
path = "src/App.jsx"
with open(path, "r") as f:
    content = f.read()

edits = [
    (
        "import React, { useState, useMemo, useEffect } from 'react';\nimport { Routes, Route, useLocation, Navigate } from 'react-router-dom';",
        "import React, { useState, useMemo, useEffect } from 'react';\nimport { Routes, Route, useLocation, Navigate } from 'react-router-dom';\nimport './styles/app.css';"
    ),
    (
        '''<div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>''',
        '''<div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="spinner-gold"></div>
      </div>'''
    ),
    (
        '''<div className="min-h-screen bg-warm-50 text-warm-800">''',
        '''<div className="app-shell">'''
    ),
    (
        '''{isSearching && (
                        <div className="max-w-4xl mx-auto px-4 py-12">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
                            <p className="text-warm-600 font-medium animate-pulse">Finding your programs...</p>
                          </div>
                        </div>
                      )}''',
        '''{isSearching && (
                        <div className="max-w-4xl mx-auto px-4 py-12">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="spinner-gold"></div>
                            <p style={{ color: 'var(--body-c)', fontWeight: 500 }} className="animate-pulse">Finding your programs...</p>
                          </div>
                        </div>
                      )}'''
    ),
]

missed = []
for old, new in edits:
    if old in content:
        content = content.replace(old, new, 1)
    else:
        missed.append(old[:60])

with open(path, "w") as f:
    f.write(content)

if missed:
    print("WARNING: could not find and apply these edits (App.jsx may already differ from expected):")
    for m in missed:
        print("  -", m, "...")
else:
    print("All 4 App.jsx edits applied cleanly.")
EOF_PYPATCH

echo ""
echo "Done. All files written/patched:"
echo "  src/styles/app.css (new)"
echo "  src/components/Auth.jsx"
echo "  src/components/NavBar.jsx"
echo "  src/components/SubscriptionPaywall.jsx"
echo "  src/components/EligibilityForm.jsx"
echo "  src/components/ResultsList.jsx"
echo "  src/App.jsx (patched, not overwritten)"
echo ""
echo "Next: npm run dev   (then check localhost:5173/app)"
