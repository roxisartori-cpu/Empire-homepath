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

      <div className="plan-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {/* Individual Tier */}
        <div className="plan-card">
          <div className="plan-tier">Individual</div>
          <div className="plan-price-row">
            <span className="plan-price">$150</span>
            <span className="plan-period">/mo</span>
          </div>
          <ul className="plan-feats">
            {[
              'Full 62-county program access',
              'Unlimited program searches',
              'Client-ready PDF reports (download/print)',
              'Email support',
              'Up-to-date — static information updated upon each search',
            ].map((feat) => (
              <li key={feat}><span className="ck">✓</span> {feat}</li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe('price_1TpszdCjCXhGzH7HxZDe5vKw')}
            disabled={loading}
            className="btn-gold-outline"
            style={{ width: '100%' }}
          >
            Get Sta
          </button>
        </div>

        {/* Professional Tier */}
        <div className="plan-card is-featured">
          <div className="plan-badge">Most Popular</div>
          <div className="plan-tier">Professional</div>
          <div className="plan-price-row">
            <span className="plan-price">$375</span>
            <span className="plan-period">/mo</span>
          </div>
          <ul className="plan-feats">
            {[
              'Up to 4 personal accounts',
              'Full 62-county program access',
              'Unlimited program searches',
              'Client-ready PDF reports (download/print)',
              'Email support',
              'Up-to-date — static information updated upon each search',
            ].map((feat) => (
              <li key={feat}><span className="ck">✓</span> {feat}</li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe('price_1Tpt0zCjCXhGzH7Hjk2He2LB')}
            disabled={loading}
         lassName="btn-gold"
            style={{ width: '100%' }}
          >
            Go Professional
          </button>
        </div>

        {/* Custom / Enterprise Tier */}
        <div className="plan-card">
          <div className="plan-tier">Custom</div>
          <div className="plan-price-row">
            <span className="plan-price" style={{ fontSize: '28px' }}>Contact Us</span>
          </div>
          <ul className="plan-feats">
            {[
              'Platform under your brand',
              'Multi-user team access',
              'API data integration',
              'Dedicated account manager',
              'Custom onboarding',
            ].map((feat) => (
              <li key={feat}><span className="ck">✓</span> {feat}</li>
            ))}
          </ul>
          <button
            onClick={() => { window.location.href = 'mailto:empirehomepath@gmail.com'; }}
            className="btn-gold-outline"
            style={{ width: '100%' }}
          >
            Contact Us
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
