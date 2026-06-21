import React, { useState } from 'react';
import { X, Mail, Link, Lock, Check } from 'lucide-react';

const SaveResults = ({ isOpen, onClose, formData }) => {
  const [email, setEmail] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Link');

  if (!isOpen) return null;

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate sending email from EmpireHomePath.com
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 2000);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy Link'), 2000);
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-warm-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-warm-400 hover:text-warm-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
            <Mail size={24} />
          </div>
          <h3 className="text-xl font-semibold text-brand-800">Save My Results</h3>
        </div>
        
        <p className="text-warm-600 text-sm mb-6 leading-relaxed">
          Get your personalized program list from <strong>Empire HomePath</strong> sent to you so you can review it later.
        </p>

        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label htmlFor="saveEmail" className="block text-sm font-medium text-warm-600 mb-1.5">
              Email Address
            </label>
            <input 
              type="email" 
              id="saveEmail" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com" 
              className="w-full px-4 py-3 rounded-xl border border-warm-200 focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none transition-all"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isSaved}
            className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
              ${isSaved 
                ? 'bg-leaf-500 text-white' 
                : 'bg-brand-500 hover:bg-brand-600 text-white shadow-md hover:shadow-lg active:scale-95'}`}
          >
            {isSaved ? (
              <>
                <Check size={18} /> Sent!
              </>
            ) : (
              'Send My List'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-warm-100">
          <p className="text-xs text-warm-400 font-bold uppercase tracking-widest mb-4">
            Or save this page for later
          </p>
          
          <button 
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-warm-200 hover:border-brand-400 text-sm font-medium text-warm-600 transition-all hover:bg-warm-50"
          >
            <Link size={16} /> {copyStatus}
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-1 text-xs text-warm-400">
            <Lock size={12} />
            <span>Your info stays private</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveResults;
