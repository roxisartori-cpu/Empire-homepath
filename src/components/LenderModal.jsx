import React, { useState } from 'react';
import { X, Send, Building2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const LenderModal = ({ isOpen, onClose, programName, apiUrl }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'email',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/lender-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          program_name: programName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(6,14,28,0.75)' }}>
      <div style={{ background: 'var(--ink-mid)', border: '1px solid var(--border-mid)', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', width: '100%', maxWidth: '640px', overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', padding: '8px', color: 'var(--muted)', background: 'none', border: 'none', borderRadius: '999px', cursor: 'pointer', zIndex: 10 }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '2fr 3fr' }}>
            <div style={{ background: 'var(--ink-lift)', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: window.innerWidth < 768 ? 'none' : '1px solid var(--border)' }}>
              <div>
                <div style={{ width: '48px', height: '48px', background: 'var(--gold-dim)', border: '1px solid var(--border-mid)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Building2 style={{ color: 'var(--gold)' }} size={22} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--white)', marginBottom: '8px', lineHeight: 1.2 }}>
                  Expert Guidance
                </h2>
                <p style={{ color: 'var(--body-c)', fontSize: '13px', marginBottom: '24px', lineHeight: 1.7 }}>
                  Connect with a specialist who understands <span style={{ fontWeight: 700, color: 'var(--gold)' }}>{programName}</span> and other New York assistance programs.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {['Free consultation', 'Lender matched to your area', 'No impact on credit score'].map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ marginTop: '2px', color: 'var(--success)', flexShrink: 0 }}>
                        <CheckCircle2 size={14} />
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--body-c)', fontWeight: 500 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <p className="field-label" style={{ marginBottom: '10px' }}>Partner Lenders</p>
                <span className="category-pill">Empire HomePath Partners</span>
              </div>
            </div>

            <div style={{ padding: '32px' }}>
              {!submitted ? (
                <>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)', marginBottom: '20px' }}>Inquire about this program</h3>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {error && (
                      <div className="auth-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}

                    <div className="field-group">
                      <label className="field-label">Full Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Jane Doe"
                        className="field-input"
                      />
                    </div>

                    <div className="form-row">
                      <div className="field-group">
                        <label className="field-label">Email Address</label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="jane@example.com"
                          className="field-input"
                        />
                      </div>
                      <div className="field-group">
                        <label className="field-label">Phone Number</label>
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(555) 000-0000"
                          className="field-input"
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label">Any specific questions?</label>
                      <textarea
                        rows="3"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="I'm curious about the income limits..."
                        className="field-input"
                        style={{ resize: 'none' }}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold"
                      style={{ width: '100%', marginTop: '4px' }}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Send size={18} />
                      )}
                      {loading ? 'Submitting...' : 'Connect Me with a Specialist'}
                    </button>
                    <p style={{ fontSize: '11px', textAlign: 'center', color: 'var(--muted)', padding: '0 16px' }}>
                      By clicking, you agree to be contacted by an Empire HomePath partner specialist. We never sell your data to third parties.
                    </p>
                  </form>
                </>
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px', padding: '48px 0' }}>
                  <div style={{ width: '72px', height: '72px', background: 'rgba(74,222,128,0.12)', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--white)' }}>Request Sent!</h3>
                  <p style={{ color: 'var(--body-c)', lineHeight: 1.7, maxWidth: '280px' }}>
                    A specialist who knows the <span style={{ fontWeight: 700, color: 'var(--gold)' }}>{programName}</span> has been notified and will reach out to you within 24 hours.
                  </p>
                  <button
                    onClick={onClose}
                    style={{ color: 'var(--gold)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', paddingTop: '12px', fontFamily: "'Inter',sans-serif" }}
                  >
                    Back to results
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LenderModal;
