import React, { useState } from 'react';
import { Menu, X, LogOut, User, Palette, LayoutDashboard, Users } from 'lucide-react';

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
        {(user?.plan === 'professional' || user?.plan === 'white-label') && !user?.team_owner_id && (
          <button
            onClick={() => onViewChange(currentView === 'team' ? 'app' : 'team')}
            className={`app-nav-btn ${currentView === 'team' ? 'is-active' : ''}`}
          >
            <Users size={14} /> Team
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
