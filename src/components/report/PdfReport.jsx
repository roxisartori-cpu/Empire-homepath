import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/print.css';

const PdfReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, formData, user } = location.state || {};

  if (!results || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
          <span className="text-4xl mb-4 block">📄</span>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Report Data Found</h2>
          <p className="text-slate-500 mb-6">Please run an eligibility search first to generate a professional report.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const branding = (user?.plan === 'white-label' && user?.white_label_settings) ? 
    (typeof user.white_label_settings === 'string' ? JSON.parse(user.white_label_settings) : user.white_label_settings) 
    : null;

  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="bg-slate-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Toolbar */}
      <div className="max-w-4xl mx-auto mb-6 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Client Eligibility Report</h1>
            <p className="text-slate-500 text-sm">Download or print this summary for your client.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all active:scale-95"
            >
              🖨️ Print / Save PDF
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Report Page */}
      <div className="report-page bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12 max-w-4xl mx-auto overflow-hidden">
        
        {/* Letterhead */}
        <div 
          className="flex items-center justify-between pb-6 mb-8" 
          style={{ borderBottom: `3px solid ${branding?.primaryColor || '#2563eb'}` }}
        >
          <div className="flex items-center gap-4">
            {branding?.logo ? (
              <img src={branding.logo} alt="Company Logo" className="w-14 h-14 object-contain rounded-xl" />
            ) : (
              <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏡</span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {branding?.companyName || 'Empire HomePath Pro'}
              </h2>
              <p className="text-xs text-slate-400">
                {branding?.contactInfo || 'Professional Mortgage Eligibility Toolkit'}
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-300">Report · {today}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Eligibility Report</h1>
        <p className="text-slate-500 mb-8">
          Summary of matched homebuyer assistance programs for your profile.
        </p>

        {/* Client Info Grid */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Search Parameters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="text-slate-400 block mb-1">County</span>
              <span className="font-semibold text-slate-800">{formData.county}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Household Income</span>
              <span className="font-semibold text-slate-800">${formData.income?.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Household Size</span>
              <span className="font-semibold text-slate-800">{formData.householdSize} persons</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Target Home Price</span>
              <span className="font-semibold text-slate-800">${formData.purchasePrice?.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Property Type</span>
              <span className="font-semibold text-slate-800">{formData.propertyType}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">First-Time Buyer</span>
              <span className="font-semibold text-slate-800">{formData.isFirstTimeBuyer ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Matched Programs */}
        <div className="space-y-6 mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Matched Assistance Programs</h2>
          
          {results.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-400">No programs directly matched these specific parameters.</p>
            </div>
          ) : (
            results.map((program, index) => (
              <div 
                key={program.id || index}
                className="p-6 rounded-r-2xl border-l-4"
                style={{ 
                  backgroundColor: program.matchScore === 'Strong' ? '#f0fdf4' : '#eff6ff',
                  borderColor: program.matchScore === 'Strong' ? '#22c55e' : '#3b82f6'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    program.matchScore === 'Strong' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {program.matchScore === 'Strong' ? '⭐ Strong Match' : '✅ Good Match'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{program.name}</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{program.description}</p>
                <div className="flex flex-wrap gap-4 text-xs">
                  {program.incomeLimit && (
                    <div className="bg-white/50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 mr-1">Income Limit:</span>
                      <span className="font-bold text-slate-700">{program.incomeLimit}</span>
                    </div>
                  )}
                  {program.priceLimit && (
                    <div className="bg-white/50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 mr-1">Price Limit:</span>
                      <span className="font-bold text-slate-700">{program.priceLimit}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/50">
                  <a href={program.url} className="text-xs text-brand-600 font-semibold hover:underline">
                    → Learn more at {new URL(program.url).hostname}
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Next Steps Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">📋 Your Next Steps</h3>
            <ol className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="font-bold text-brand-600 min-w-[20px]">1.</span>
                <span>Contact a participating lender to discuss these programs.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-brand-600 min-w-[20px]">2.</span>
                <span>Get a formal pre-approval to lock in your eligibility.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-brand-600 min-w-[20px]">3.</span>
                <span>Identify HUD-approved housing counselors for guidance.</span>
              </li>
            </ol>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">🔗 Useful Resources</h3>
            <div className="space-y-3 text-sm">
              <a href="https://hcr.ny.gov" className="block text-brand-600 hover:underline">NY State Homes & Community Renewal</a>
              <a href="https://hud.gov/homebuying" className="block text-brand-600 hover:underline">HUD First-Time Homebuyer Guide</a>
              <a href="https://www.sonyma.org" className="block text-brand-600 hover:underline">Official SONYMA Program Portal</a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-100 text-center">
          <p className="text-sm font-bold text-slate-700 mb-1">
            {branding?.companyName || 'Empire HomePath Pro'}
          </p>
          <p className="text-xs text-slate-400 mb-4">
            {branding?.contactInfo || 'Professional Homebuyer Assistance Matching'}
          </p>
          <div className="inline-block px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[10px] text-slate-300 uppercase tracking-widest">
            Powered by Empire HomePath Pro
          </div>
        </div>

      </div>
    </div>
  );
};

export default PdfReport;
