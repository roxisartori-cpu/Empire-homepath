import React, { useState } from 'react';

const PLAN_DETAILS = {
  individual: {
    tier: 'Individual',
    price: '$150',
    feats: [
      'Full 62-county program access',
      'Unlimited program searches',
      'Client-ready PDF reports (download/print)',
      'Email support',
      'Up-to-date — static information updated upon each search',
    ],
    buttonLabel: 'Get Started',
    buttonClass: 'btn-gold-outline',
  },
  professional: {
    tier: 'Professional',
    price: '$375',
    feats: [
      'Up to 4 personal accounts',
      'Full 62-county program access',
      'Unlimited program searches',
      'Client-ready PDF reports (download/print)',
      'Email support',
      'Up-to-date — static information updated upon each search',
    ],
    buttonLabel: 'Go Professional',
    buttonClass: 'btn-gold',
  },
};

const SubscriptionPaywall = ({ user, onSubscribeSuccess, preselectedPlan }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validPreselected = preselectedPlan === 'individual' || preselectedPlan === 'professional'
    ? preselectedPlan
    : null;

  const [showAllPlans, setShowAllPlans] = useState(!validPreselected);

  const handleSubscribe = async (plan) => {
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
        body: JSON.stringify({ plan }),
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

  if (validPreselected && !showAllPlans) {
    const plan = PLAN_DETAILS[validPreselected];
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="auth-eyebrow" style={{ justifyContent: 'center' }}>Confirm Your Plan</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,32px)', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.02em' }}>
            You're subscribing to <span style={{ color: 'var(--gold)' }}>{plan.tier}</span>
          </h2>
        </div>

        {error && (
          <div className="auth-error" style={{ textAlign: 'center', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <div className={`plan-card ${validPreselected === 'professional' ? 'is-featured' : ''}`}>
          <div className="plan-tier">{plan.tier}</div>
          <div className="plan-price-row">
            <span className="plan-price">{plan.price}</span>
            <span className="plan-period">/mo</span>
          </div>
          <ul className="plan-feats">
            {plan.feats.map((feat) => (
              <li key={feat}><span className="ck">✓</span> {feat}</li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe(validPreselected)}
            disabled={loading}
            className={plan.buttonClass}
            style={{ width: '100%' }}
          >
            {loading ? 'Redirecting to secure checkout...' : plan.buttonLabel}
          </button>
        </div>

        <p style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={() => setShowAllPlans(true)}
            style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', fontFamily: "'Inter',sans-serif" }}
          >
            Not the right plan? See all options
          </button>
        </p>

        <p style={{ marginTop: '16px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
          Secure billing with Stripe. Cancel anytime in your dashboard.
        </p>
      </div>
    );
  }

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
        <div className="plan-card">
          <div className="plan-tier">Individual</div>
          <div className="plan-price-row">
            <span className="plan-price">$150</span>
            <span className="plan-period">/mo</span>
          </div>
          <ul className="plan-feats">
            {PLAN_DETAILS.individual.feats.map((feat) => (
              <li key={feat}><span className="ck">✓</span> {feat}</li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe('individual')}
            disabled={loading}
            className="btn-gold-outline"
            style={{ width: '100%' }}
          >
            Get Started
          </button>
        </div>

        <div className="plan-card is-featured">
          <div className="plan-badge">Most Popur</div>
          <div className="plan-tier">Professional</div>
          <div className="plan-price-row">
            <span className="plan-price">$375</span>
            <span className="plan-period">/mo</span>
          </div>
          <ul className="plan-feats">
            {PLAN_DETAILS.professional.feats.map((feat) => (
              <li key={feat}><span className="ck">✓</span> {feat}</li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe('professional')}
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%' }}
          >
            Go Professional
          </button>
        </div>

        <div className="plan-card">
          <div className="plan-tier">Custom</div>
          <div className="plan-price-row">
            <span className="plan-price" style={{ fontSize: '28px' }}>Contact Us</span>
          </div>
          <ul className="plan-feats">
            {[
              'All 62 NY Counties, State, Government and Municipal program access.',
              'API data integration',
              'Client Ready PDF reports Download/Print',
              'Your Company or Organization branding on search results.',
              'Multi-user team access.',
              'Unlimited Full platform access.',
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
