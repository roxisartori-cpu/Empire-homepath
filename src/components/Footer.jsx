import React from 'react';
import { Home } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-warm-800 text-warm-400 py-12 px-4 mt-12 text-center text-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6 text-white font-bold text-lg">
          <span className="text-2xl">🏡</span>
          <span>Empire HomePath</span>
        </div>
        <p className="mb-4 max-w-md mx-auto leading-relaxed">
          Supporting New Yorkers on their journey to homeownership with clarity, care, and jargon-free guidance.
        </p>
        <p className="mb-8">
          Not affiliated with NY State government. Always verify with official program administrators.
        </p>
        <div className="pt-8 border-t border-warm-600/30 text-xs">
          &copy; {new Date().getFullYear()} Empire HomePath. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
