import React, { useState, useEffect } from 'react';
import { Palette, Upload, Globe, Save, CheckCircle } from 'lucide-react';

const WhiteLabelSettings = ({ user, onUpdateUser }) => {
  const [settings, setSettings] = useState({
    logo: '',
    primaryColor: '#C9A84C',
    secondaryColor: '#4ADE80',
    companyName: '',
    contactInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.white_label_settings) {
      try {
        const parsed = typeof user.white_label_settings === 'string'
          ? JSON.parse(user.white_label_settings)
          : user.white_label_settings;
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/update-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          white_label_settings: settings
        }),
      });

      if (res.ok) {
        setSaved(true);
        if (onUpdateUser) onUpdateUser({ ...user, white_label_settings: settings });
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="auth-eyebrow" style={{ justifyContent: 'center' }}>Custom Branding</div>
        <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Palette style={{ color: 'var(--gold)' }} size={24} /> White Label Branding
        </h2>
        <p style={{ color: 'var(--body-c)', marginTop: '8px', fontSize: '13px' }}>Customize the platform with your company's identity.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 900 ? '1fr' : '1fr 1fr', gap: '32px' }}>
        <div className="card-dark card-dark-pad" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div className="field-group">
            <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={13} /> Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({...settings, companyName: e.target.value})}
              placeholder="e.g. Acme Mortgage Group"
              className="field-input"
            />
          </div>

          <div className="form-row">
            <div className="field-group">
              <label className="field-label">Primary Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  style={{ width: '44px', height: '44px', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-mid)', background: 'none', padding: '2px' }}
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="field-input"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Secondary Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                  style={{ width: '44px', height: '44px', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-mid)', background: 'none', padding: '2px' }}
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                  className="field-input"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Upload size={13} /> Logo URL
            </label>
            <input
              type="text"
              value={settings.logo}
              onChange={(e) => setSettings({...settings, logo: e.target.value})}
              placeholder="https://example.com/logo.png"
              className="field-input"
            />
            <p className="field-hint">Must be a direct link ending in .png or .jpg — not a website homepage</p>
          </div>

          <div className="field-group">
            <label className="field-label">Contact Info (shown on reports)</label>
            <textarea
              rows="3"
              value={settings.contactInfo}
              onChange={(e) => setSettings({...settings, contactInfo: e.target.value})}
              placeholder="e.g. jane@acmemortgage.com | (555) 123-4567"
              className="field-input"
              style={{ resize: 'none' }}
            ></textarea>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%' }}
          >
            {saved ? <><CheckCircle size={18} /> Settings Saved!</> : <><Save size={18} /> Save Branding</>}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.85, paddingLeft: '4px' }}>Live Preview — how your clients will see it</h3>
          <div style={{ background: 'var(--white)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: settings.primaryColor }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {settings.logo ? (
                  <img
                    src={settings.logo}
                    alt="Logo"
                    style={{ height: '32px', width: '32px', objectFit: 'contain', borderRadius: '6px', background: '#fff' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.25)', borderRadius: '8px', display: settings.logo ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '10px' }}>LOGO</div>
                <span style={{ color: '#fff', fontWeight: 700 }}>{settings.companyName || 'Your Company'}</span>
              </div>
              <div style={{ width: '24px', height: '24px', borderRadius: '999px', background: 'rgba(255,255,255,0.2)' }}></div>
            </div>

            <div style={{ padding: '24px', background: '#f8f8f8' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Orange County · 3 Programs Found</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '14px' }}>
                  <p style={{ fontSize: '11px', color: '#999', fontWeight: 600, marginBottom: '4px' }}>DPA LOAN</p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>$10,000</p>
                </div>
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '14px' }}>
                  <p style={{ fontSize: '11px', color: '#999', fontWeight: 600, marginBottom: '4px' }}>FORGIVABLE GRANT</p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>$15,000</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'County Down Payment Assistance', tag: 'Forgivable · ≤ 120% AMI' },
                  { name: 'HOME Investment Grant Program', tag: 'Non-Repayable · ≤ 80% AMI' },
                ].map((prog) => (
                  <div key={prog.name} style={{ background: '#fff', padding: '14px 16px', borderRadius: '12px', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{prog.name}</p>
                      <p style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{prog.tag}</p>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', backgroundColor: settings.secondaryColor + '20', color: settings.secondaryColor, border: `1px solid ${settings.secondaryColor}` }}>Open</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: settings.primaryColor }}>{settings.companyName || 'Your Company'}</p>
                <p style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>{settings.contactInfo || 'Contact details appear here'}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--gold-dim)', border: '1px solid var(--border-mid)', padding: '20px', borderRadius: '12px' }}>
            <h4 style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '13px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={15} /> Professional Advantage
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--body-c)', lineHeight: 1.6 }}>
              Your clients see your brand, not ours. Strengthen your authority and trust by providing a seamless, professional experience under your own company identity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteLabelSettings;
