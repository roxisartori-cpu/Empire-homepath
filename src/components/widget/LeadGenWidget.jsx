import React, { useState, useMemo } from 'react';
import { matchPrograms } from '../../matching';
import programsData from '../../data/programs.json';
import { NY_COUNTIES } from '../../counties';

const LeadGenWidget = ({ proId, branding, apiUrl }) => {
  const [step, setStep] = useState('form'); // 'form', 'email', 'results'
  const [formData, setFormData] = useState({
    county: '',
    income: '',
    purchasePrice: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);
  const [matchedList, setMatchedList] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'income' || name === 'purchasePrice' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.county || !formData.income || !formData.purchasePrice) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const results = matchPrograms(programsData, {
        ...formData,
        householdSize: 2, // Default for widget
        isFirstTimeBuyer: true,
        propertyType: 'Single Family'
      });
      
      setMatchedCount(results.length);
      setMatchedList(results.slice(0, 3)); // Show top 3
      setStep('email');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return;

    setIsSubmitting(true);

    try {
      await fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pro_id: proId,
          email: formData.email,
          county: formData.county,
          income: formData.income,
          purchase_price: formData.purchasePrice,
          matched_count: matchedCount
        })
      });
      
      setStep('results');
    } catch (err) {
      console.error('Lead capture failed:', err);
      // Still show results to user even if capture fails
      setStep('results');
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryColor = branding?.primaryColor || '#3b82f6';

  if (step === 'results') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 animate-fadeIn text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Results Ready!</h3>
        <p className="text-sm text-slate-500 mb-6">
          We found <strong>{matchedCount}</strong> potential programs for you. 
          A detailed report has been sent to your email.
        </p>
        
        <div className="space-y-3 mb-8 text-left">
          {matchedList.map((p, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-lg mt-0.5">{p.matchScore === 'Strong' ? '⭐' : '✅'}</span>
              <div>
                <p className="text-sm font-bold text-slate-800">{p.name}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{p.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setStep('form')}
          className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
        >
          Start over
        </button>
      </div>
    );
  }

  if (step === 'email') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 animate-fadeIn">
        <div className="text-center mb-6">
          <span className="text-3xl">✨</span>
          <h3 className="text-lg font-bold text-slate-800 mt-2">Almost there!</h3>
          <p className="text-sm text-slate-500">
            We found <strong>{matchedCount}</strong> programs. Enter your email to see the full list and eligibility details.
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <input 
            type="email" 
            name="email"
            placeholder="your@email.com"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all"
            style={{ '--tw-ring-color': primaryColor, borderColor: isSubmitting ? '#e2e8f0' : undefined }}
            disabled={isSubmitting}
          />
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Show My Results →'
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100" style={{ maxWidth: '480px' }}>
      <div className="text-center mb-6">
        <span className="text-3xl">🏡</span>
        <h3 className="text-lg font-bold text-slate-800 mt-2" style={{ color: branding?.primaryColor }}>
          See What Programs You Qualify For
        </h3>
        <p className="text-xs text-slate-400">Free check — takes 30 seconds</p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-3">
        <select 
          name="county"
          required
          value={formData.county}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:outline-none transition-all"
          style={{ '--tw-ring-color': primaryColor }}
        >
          <option value="">Select your county...</option>
          {NY_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          <input 
            type="number" 
            name="income"
            placeholder="Your annual household income"
            required
            value={formData.income}
            onChange={handleInputChange}
            className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:outline-none transition-all"
            style={{ '--tw-ring-color': primaryColor }}
          />
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          <input 
            type="number" 
            name="purchasePrice"
            placeholder="Home price you're looking at"
            required
            value={formData.purchasePrice}
            onChange={handleInputChange}
            className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:outline-none transition-all"
            style={{ '--tw-ring-color': primaryColor }}
          />
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
          style={{ backgroundColor: primaryColor }}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            '🔍 Check Eligibility — Free'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[10px] text-slate-400 mb-1">🔒 Your info stays private · No spam</p>
        <p className="text-[9px] text-slate-300">
          Powered by <strong className="text-slate-400">{branding?.companyName || 'Empire HomePath'}</strong>
        </p>
      </div>
    </div>
  );
};

export default LeadGenWidget;
