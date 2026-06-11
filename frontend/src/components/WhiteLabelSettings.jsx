import React, { useState, useEffect } from 'react';
import { Palette, Upload, Globe, Save, CheckCircle } from 'lucide-react';

const WhiteLabelSettings = ({ user, onUpdateUser }) => {
  const [settings, setSettings] = useState({
    logo: '',
    primaryColor: '#2563eb',
    secondaryColor: '#16a34a',
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
      // In a real app, users update their own settings via a profile endpoint
      // For now, we use the update-user endpoint if we're an admin, or we'd need a new endpoint
      // Assuming we might need a general update-me endpoint later, but for now let's try a dedicated one
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
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-brand-900 flex items-center justify-center gap-3">
          <Palette className="text-brand-600" /> White Label Branding
        </h2>
        <p className="text-warm-600 mt-2">Customize the platform with your company's identity.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Settings Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-warm-100 p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-warm-700 mb-2 flex items-center gap-2">
              <Globe size={16} /> Company Name
            </label>
            <input 
              type="text" 
              value={settings.companyName}
              onChange={(e) => setSettings({...settings, companyName: e.target.value})}
              placeholder="e.g. Acme Mortgage Group"
              className="w-full px-4 py-3 rounded-xl border border-warm-200 focus:ring-2 focus:ring-brand-400 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-warm-700 mb-2">Primary Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input 
                  type="text" 
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="flex-1 px-3 py-2 text-sm border border-warm-200 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-warm-700 mb-2">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input 
                  type="text" 
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                  className="flex-1 px-3 py-2 text-sm border border-warm-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-warm-700 mb-2 flex items-center gap-2">
              <Upload size={16} /> Logo URL
            </label>
            <input 
              type="text" 
              value={settings.logo}
              onChange={(e) => setSettings({...settings, logo: e.target.value})}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-3 rounded-xl border border-warm-200 focus:ring-2 focus:ring-brand-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-warm-700 mb-2">Contact Info (for reports)</label>
            <textarea 
              rows="3"
              value={settings.contactInfo}
              onChange={(e) => setSettings({...settings, contactInfo: e.target.value})}
              placeholder="Email, phone, or office address..."
              className="w-full px-4 py-3 rounded-xl border border-warm-200 focus:ring-2 focus:ring-brand-400 outline-none resize-none"
            ></textarea>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {saved ? <><CheckCircle size={20} /> Settings Saved!</> : <><Save size={20} /> Save Branding</>}
          </button>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <h3 className="font-bold text-warm-800 px-2">Live Preview</h3>
          <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
            {/* Branded Header Preview */}
            <div className="p-4 flex items-center justify-between" style={{ backgroundColor: settings.primaryColor }}>
              <div className="flex items-center gap-2">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="h-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-xs">LOGO</div>
                )}
                <span className="text-white font-bold">{settings.companyName || 'Your Company'}</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/20"></div>
            </div>

            {/* Content Preview */}
            <div className="p-6 bg-warm-50">
              <div className="h-4 w-1/3 bg-warm-200 rounded mb-6"></div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="h-20 bg-white rounded-xl border border-warm-100 p-3 space-y-2">
                  <div className="h-3 w-1/2 bg-warm-100 rounded"></div>
                  <div className="h-5 w-3/4 bg-warm-200 rounded"></div>
                </div>
                <div className="h-20 bg-white rounded-xl border border-warm-100 p-3 space-y-2">
                  <div className="h-3 w-1/2 bg-warm-100 rounded"></div>
                  <div className="h-5 w-3/4 bg-warm-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-warm-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-warm-100"></div>
                      <div className="space-y-1">
                        <div className="h-3 w-32 bg-warm-200 rounded"></div>
                        <div className="h-2 w-24 bg-warm-100 rounded"></div>
                      </div>
                    </div>
                    <div className="w-16 h-6 rounded-full" style={{ backgroundColor: settings.secondaryColor + '20', border: `1px solid ${settings.secondaryColor}` }}></div>
                  </div>
                ))}
              </div>
              
              {/* Branded Footer Preview */}
              <div className="mt-8 pt-4 border-t border-warm-200 text-center">
                <p className="text-xs font-bold" style={{ color: settings.primaryColor }}>{settings.companyName || 'Your Company'}</p>
                <p className="text-[10px] text-warm-400 mt-1">{settings.contactInfo || 'Contact details appear here'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
            <h4 className="font-bold text-brand-800 text-sm mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-brand-600" /> Professional Advantage
            </h4>
            <p className="text-xs text-brand-700 leading-relaxed">
              Your clients see your brand, not ours. Strengthen your authority and trust by providing a seamless, professional experience under your own company identity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteLabelSettings;
