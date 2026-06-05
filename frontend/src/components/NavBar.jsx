import React, { useState } from 'react';
import { Home, Menu, X } from 'lucide-react';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-brand-200">
      <div className="max-w-4xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-xl font-bold text-brand-800">
          <span className="text-2xl">🏡</span>
          Empire HomePath
        </a>
        
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#glossary" className="text-warm-600 hover:text-brand-500 font-medium text-sm transition">📖 Glossary</a>
          <a href="#checklist" className="text-warm-600 hover:text-brand-500 font-medium text-sm transition">📋 Am I Ready?</a>
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
        <div className="md:hidden bg-white border-b border-warm-200 px-4 py-4 space-y-3 animate-fade-in">
          <a href="#glossary" className="block text-warm-600 hover:text-brand-500 font-medium" onClick={() => setIsMenuOpen(false)}>📖 Glossary</a>
          <a href="#checklist" className="block text-warm-600 hover:text-brand-500 font-medium" onClick={() => setIsMenuOpen(false)}>📋 Am I Ready?</a>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
