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

      // In a real app, we'd redirect to Stripe Checkout
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
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-brand-900 mb-4">Professional Eligibility Engine</h2>
        <p className="text-xl text-warm-600 max-w-2xl mx-auto">
          Unlock instant matching for 60+ assistance programs across all 62 NY counties.
          Qualify more buyers in seconds.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 text-center rounded-xl">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Standard Tier */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-warm-100 flex flex-col">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-brand-800 mb-2">Standard Tier</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-black text-warm-900">$150</span>
              <span className="text-warm-500">/mo</span>
            </div>
            <p className="text-brand-600 font-semibold mb-6 italic text-sm">7-day free trial included</p>
            <ul className="space-y-4">
              {['62-county matching engine', 'Unlimited searches', 'Client PDF reports', 'Real-time program updates'].map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-warm-700">
                  <span className="text-brand-500 font-bold">✓</span> {feat}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => handleSubscribe('price_standard_placeholder')}
            disabled={loading}
            className="mt-auto w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            Start 7-Day Free Trial
          </button>
        </div>

        {/* White Label Tier */}
        <div className="bg-brand-50 p-8 rounded-3xl shadow-xl border-2 border-brand-200 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-brand-500 text-white px-6 py-1 rounded-bl-2xl text-xs font-bold uppercase tracking-wider">
            Most Popular
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-brand-800 mb-2">White Label Tier</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-black text-warm-900">$375</span>
              <span className="text-warm-500">/mo</span>
            </div>
            <p className="text-brand-600 font-semibold mb-6 italic text-sm">Everything in Standard plus:</p>
            <ul className="space-y-4">
              {['Custom logo & colors', 'Lead generation widgets', 'Branded client portals', 'Priority support'].map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-warm-700">
                  <span className="text-brand-500 font-bold">✓</span> {feat}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => handleSubscribe('price_whitelabel_placeholder')}
            disabled={loading}
            className="mt-auto w-full bg-brand-800 hover:bg-brand-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            Go Professional
          </button>
        </div>
      </div>
      
      <p className="mt-12 text-center text-warm-400 text-sm">
        Secure billing with Stripe. Cancel anytime in your dashboard.
      </p>
    </div>
  );
};

export default SubscriptionPaywall;
