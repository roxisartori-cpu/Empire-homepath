import React, { useState } from 'react';
import { Home, Menu, X, LogOut, User } from 'lucide-react';

const NavBar = ({ user, onLogout, onViewChange, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-brand-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <button onClick={() => onViewChange('app')} className="flex items-center gap-2 text-xl font-bold text-brand-800">
          <span className="text-2xl">🏡</span>
          Empire HomePath Pro
        </button>
        
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {user?.role === 'admin' && (
            <button 
              onClick={() => onViewChange(currentView === 'admin' ? 'app' : 'admin')}
              className="text-brand-600 hover:text-brand-700 font-bold text-sm transition px-4 py-2 bg-brand-50 rounded-lg border border-brand-100"
            >
              {currentView === 'admin' ? '🚀 Go to App' : '🛠 Admin Panel'}
            </button>
          )}
          <a href="#glossary" className="text-warm-600 hover:text-brand-500 font-medium text-sm transition">📖 Glossary</a>
          <a href="#checklist" className="text-warm-600 hover:text-brand-500 font-medium text-sm transition">📋 Checklist</a>
          
          {user && (
            <div className="flex items-center gap-4 pl-6 border-l border-warm-200">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">{user.plan} Tier</span>
                <span className="text-sm text-warm-500 truncate max-w-[150px]">{user.email}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2.5 text-warm-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button 
          className="md:hidden p-2 text-warm-600 hover:text-brand-500" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-warm-200 px-4 py-6 space-y-4 shadow-xl animate-fade-in">
          <a href="#glossary" className="block text-lg text-warm-700 hover:text-brand-600 font-semibold" onClick={() => setIsMenuOpen(false)}>📖 Glossary</a>
          <a href="#checklist" className="block text-lg text-warm-700 hover:text-brand-600 font-semibold" onClick={() => setIsMenuOpen(false)}>📋 Checklist</a>
          
          {user && (
            <div className="pt-4 mt-4 border-t border-warm-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-800">{user.email}</p>
                  <p className="text-xs text-warm-500 uppercase font-bold tracking-widest">{user.plan} Tier</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-red-500 font-bold px-4 py-2 bg-red-50 rounded-xl"
              >
                <LogOut size={18} /> Exit
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
