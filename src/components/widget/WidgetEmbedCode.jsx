import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Code, Smartphone, Monitor } from 'lucide-react';

const WidgetEmbedCode = ({ user }) => {
  const [copied, setCopied] = useState(null);
  const [theme, setTheme] = useState('default'); // 'default', 'white-label'
  
  const branding = (user?.plan === 'white-label' && user?.white_label_settings) ? 
    (typeof user.white_label_settings === 'string' ? JSON.parse(user.white_label_settings) : user.white_label_settings) 
    : null;

  const baseUrl = window.location.origin;
  const proId = user?.id || 'PRO_ID';
  const primaryColor = encodeURIComponent(branding?.primaryColor || '#3b82f6');
  const companyName = encodeURIComponent(branding?.companyName || 'Empire HomePath');
  
  const iframeSrc = `${baseUrl}/widget/embed?pro_id=${proId}&primary=${primaryColor}&company=${companyName}`;
  
  const iframeCode = `<iframe 
  src="${iframeSrc}" 
  width="100%" 
  height="500" 
  style="border: none; max-width: 480px; margin: 0 auto; display: block;"
  title="Homebuyer Assistance Matcher"
></iframe>`;

  const jsCode = `<div id="homepath-widget"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = "${iframeSrc}";
    iframe.width = "100%";
    iframe.height = "500";
    iframe.style.border = "none";
    iframe.style.maxWidth = "480px";
    iframe.style.margin = "0 auto";
    iframe.style.display = "block";
    document.getElementById('homepath-widget').appendChild(iframe);
  })();
</script>`;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
            <Code size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Lead Generation Widget</h3>
            <p className="text-sm text-slate-500">Capture new leads directly from your website</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-6">
          {/* Left: Code Snippets */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Iframe Embed (Recommended)</span>
                <button 
                  onClick={() => copyToClipboard(iframeCode, 'iframe')}
                  className="text-xs flex items-center gap-1.5 text-brand-600 font-semibold hover:text-brand-700"
                >
                  {copied === 'iframe' ? <Check size={14} /> : <Copy size={14} />}
                  {copied === 'iframe' ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 overflow-hidden">
                <pre className="text-xs text-slate-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                  {iframeCode}
                </pre>
              </div>
              <p className="mt-2 text-[10px] text-slate-400">Works with WordPress, Squarespace, Wix, and custom sites.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">JavaScript Snippet</span>
                <button 
                  onClick={() => copyToClipboard(jsCode, 'js')}
                  className="text-xs flex items-center gap-1.5 text-brand-600 font-semibold hover:text-brand-700"
                >
                  {copied === 'js' ? <Check size={14} /> : <Copy size={14} />}
                  {copied === 'js' ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 overflow-hidden">
                <pre className="text-xs text-slate-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                  {jsCode}
                </pre>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <a 
                href={iframeSrc} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline"
              >
                Preview Widget in New Tab <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Right: Live Preview Simulation */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-4 mb-4 text-slate-400">
              <Monitor size={20} className="text-brand-500" />
              <div className="h-4 w-px bg-slate-200"></div>
              <Smartphone size={20} />
            </div>
            <div className="w-full max-w-[360px] transform scale-[0.85] origin-top bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="bg-slate-800 p-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                <div className="bg-slate-700 h-3 flex-1 rounded mx-2"></div>
              </div>
              <div className="p-4 bg-slate-50">
                <div className="h-3 w-1/2 bg-slate-200 rounded mb-2"></div>
                <div className="h-2 w-3/4 bg-slate-100 rounded mb-4"></div>
                <iframe src={iframeSrc} width="100%" height="340" className="rounded-lg shadow-sm border-0 pointer-events-none" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-4 text-center">
              This is how the widget will appear on your website.<br/>
              It automatically uses your <strong>{branding ? 'White Label' : 'Default'}</strong> branding.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-1">Instant Leads</h4>
          <p className="text-xs text-slate-500">Leads are stored in your dashboard the moment they enter their email.</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-1">Mobile Optimized</h4>
          <p className="text-xs text-slate-500">The widget is fully responsive and works perfectly on all devices.</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-1">Auto-Matching</h4>
          <p className="text-xs text-slate-500">Uses the latest 2026 program limits to provide instant value to visitors.</p>
        </div>
      </div>
    </div>
  );
};

export default WidgetEmbedCode;
