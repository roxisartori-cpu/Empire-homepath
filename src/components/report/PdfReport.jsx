import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import appContent from '../../data/app_content.json';
import '../../styles/print.css';

const KEY_TERMS_FOR_REPORT = [
  'AMI (Area Median Income)',
  'Forgivable Loan',
  'Down Payment Assistance (DPA)',
];

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

  const primaryColor = branding?.primaryColor || '#0A1628';
  const secondaryColor = branding?.secondaryColor || '#C9A84C';
  const companyName = branding?.companyName || 'Empire HomePath Pro';

  const today = new Date();
  const todayFormatted = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const reportRef = `EHP-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${(formData.county || 'NY').slice(0, 3).toUpperCase()}`;

  const dataYears = results.map(p => p.dataYear).filter(Boolean);
  const mostRecentYear = dataYears.length ? Math.max(...dataYears) : null;

  const relevantTerms = appContent.glossary.filter(t => KEY_TERMS_FOR_REPORT.includes(t.term));

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

      <div className="report-page bg-white rounded-2xl shadow-xl border border-slate-200 max-w-4xl mx-auto overflow-hidden">

        {/* Letterhead */}
        <div
          className="flex items-center justify-between px-8 py-6 md:px-12"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center gap-4">
            {branding?.logo ? (
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={branding.logo} alt="Company Logo" className="w-full h-full object-contain p-1" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <span className="text-2xl">🏡</span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">{companyName}</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {branding?.contactInfo || 'Professional Mortgage Eligibility Toolkit'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs block" style={{ color: 'rgba(255,255,255,0.6)' }}>Report · {todayFormatted}</span>
            <span className="text-[10px] block mt-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>Ref# {reportRef}</span>
          </div>
        </div>

        <div className="p-8 md:p-12">

          {/* Section 01 — Overview */}
          <div className="report-section mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: secondaryColor }}>Section 01</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 mt-1">
              {formData.clientName ? `Prepared for ${formData.clientName}` : 'Homebuyer Eligibility Report'}
            </h1>
            <p className="text-slate-500 mb-6 max-w-2xl">
              {formData.clientName ? (
                <>This report was prepared specifically for you by {companyName}, summarizing every homebuyer assistance program you may currently qualify for in <strong>{formData.county} County, NY</strong>.</>
              ) : (
                <>Summary of matched homebuyer assistance programs for this buyer profile in <strong>{formData.county} County, NY</strong>.</>
              )}
              {mostRecentYear && <span className="text-slate-400"> Data verified current as of {mostRecentYear}.</span>}
            </p>

            <div
              className="rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4"
              style={{ backgroundColor: `${primaryColor}0D`, border: `1px solid ${primaryColor}33` }}
            >
              <div>
                <span className="block text-3xl font-extrabold" style={{ color: primaryColor }}>{results.length}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Program{results.length !== 1 ? 's' : ''} Matched</span>
              </div>
              <div className="text-sm text-slate-600 max-w-md">
                These programs are matched specifically to this household's income, target purchase price, and county — not a generic statewide list.
              </div>
            </div>
          </div>

          {/* Section 02 — Search Criteria */}
          <div className="report-section bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: secondaryColor }}>Section 02</span>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 mt-1">Search Parameters</h3>
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

          {/* Contact CTA */}
          {branding?.contactInfo && (
            <div
              className="report-section rounded-2xl p-6 mb-8 flex items-center justify-between gap-4 flex-wrap"
              style={{ backgroundColor: primaryColor }}
            >
              <div>
                <p className="text-white font-bold mb-1">Questions about these programs?</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{branding.contactInfo}</p>
              </div>
              <span
                className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full"
                style={{ backgroundColor: secondaryColor, color: primaryColor }}
              >
                Reach out today
              </span>
            </div>
          )}

          {/* Section 03 — Matched Programs */}
          <div className="report-page-break mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: secondaryColor }}>Section 03</span>
            <h2 className="text-xl font-bold text-slate-900 mb-4 mt-1">Matched Assistance Programs</h2>

            <div className="space-y-6">
              {results.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-400">No programs directly matched these specific parameters.</p>
                </div>
              ) : (
                results.map((program, index) => (
                  <div
                    key={program.id || index}
                    className="report-program-card p-6 rounded-r-2xl border-l-4"
                    style={{
                      backgroundColor: program.matchScore === 'Strong' ? '#f0fdf4' : '#eff6ff',
                      borderColor: program.matchScore === 'Strong' ? '#22c55e' : '#3b82f6'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        program.matchScore === 'Strong' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {program.matchScore === 'Strong' ? '⭐ Strong Match' : '✅ Good Match'}
                      </span>
                      {program.category && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                          {program.category}
                        </span>
                      )}
                      {program.dataYear && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white text-slate-400 border border-slate-200">
                          Verified {program.dataYear}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{program.name}</h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">{program.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs mb-4">
                      {program.incomeLimit && (
                        <div className="bg-white/70 px-3 py-1.5 rounded-lg border border-slate-100">
                          <span className="text-slate-400 mr-1">Income Limit:</span>
                          <span className="font-bold text-slate-700">{program.incomeLimit}</span>
                        </div>
                      )}
                      {program.priceLimit && (
                        <div className="bg-white/70 px-3 py-1.5 rounded-lg border border-slate-100">
                          <span className="text-slate-400 mr-1">Price Limit:</span>
                          <span className="font-bold text-slate-700">{program.priceLimit}</span>
                        </div>
                      )}
                    </div>
                    {program.url && (
                      <a
                        href={program.url}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg text-white no-underline"
                        style={{ backgroundColor: primaryColor }}
                      >
                        View Official Program Page →
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 04 — Understanding Your Options */}
          {relevantTerms.length > 0 && (
            <div className="report-section mb-10">
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: secondaryColor }}>Section 04</span>
              <h2 className="text-xl font-bold text-slate-900 mb-4 mt-1">Understanding Your Options</h2>
              <p className="text-sm text-slate-500 mb-4">A few plain-English terms that come up in the programs above:</p>
              <div className="grid md:grid-cols-1 gap-4">
                {relevantTerms.map((t) => (
                  <div key={t.term} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h4 className="font-bold text-slate-800 text-sm mb-1.5">{t.term}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{t.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 05 — Next Steps & Resources */}
          <div className="report-section grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: secondaryColor }}>Section 05</span>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">📋 Your Next Steps</h3>
              <ol className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="font-bold min-w-[20px]" style={{ color: primaryColor }}>1.</span>
                  <span>Contact a participating lender to discuss these programs.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold min-w-[20px]" style={{ color: primaryColor }}>2.</span>
                  <span>Get a formal pre-approval to lock in your eligibility.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold min-w-[20px]" style={{ color: primaryColor }}>3.</span>
                  <span>Identify HUD-approved housing counselors for guidance.</span>
                </li>
              </ol>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-widest block mb-2 invisible md:visible">·</span>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">🔗 Useful Resources</h3>
              <div className="space-y-3 text-sm">
                <a href="https://hcr.ny.gov" className="block hover:underline" style={{ color: primaryColor }}>NY State Homes &amp; Community Renewal</a>
                <a href="https://hud.gov/homebuying" className="block hover:underline" style={{ color: primaryColor }}>HUD First-Time Homebuyer Guide</a>
                <a href="https://www.sonyma.org" className="block hover:underline" style={{ color: primaryColor }}>Official SONYMA Program Portal</a>
              </div>
            </div>
          </div>

          {/* Advisor recap */}
          <div className="report-section rounded-2xl p-6 mb-8 border" style={{ borderColor: `${primaryColor}33`, backgroundColor: `${primaryColor}0D` }}>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: secondaryColor }}>Prepared By</span>
            <div className="flex items-center gap-4 mt-2">
              {branding?.logo ? (
                <img src={branding.logo} alt="Company Logo" className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-slate-200" />
              ) : (
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                  <span className="text-xl">🏡</span>
                </div>
              )}
              <div>
                <p className="font-bold text-slate-800">{companyName}</p>
                <p className="text-sm text-slate-500">{branding?.contactInfo || 'Contact your advisor for personalized guidance.'}</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-slate-400 text-center mb-8 leading-relaxed max-w-2xl mx-auto">
            Program details, income limits, and funding availability are subject to change without notice.
            Always confirm current eligibility requirements directly with the program administrator before advising a client to proceed.
          </p>

          {/* Footer */}
          <div className="pt-8 border-t border-slate-100 text-center">
            <p className="text-sm font-bold text-slate-700 mb-1">{companyName}</p>
            <p className="text-xs text-slate-400 mb-4">
              {branding?.contactInfo || 'Professional Homebuyer Assistance Matching'}
            </p>
            <div className="inline-block px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[10px] text-slate-300 uppercase tracking-widest">
              Powered by Empire HomePath Pro
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfReport;
