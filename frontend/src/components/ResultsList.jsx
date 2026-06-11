import React from 'react';
import { ExternalLink, ChevronRight, Star, RefreshCw, CheckCircle, AlertCircle, Building2 } from 'lucide-react';

const ResultsList = ({ programs, onSaveClick, verificationStates = {}, onVerifyLive, onLenderClick, isAdminView = false }) => {
  if (programs.length === 0) {
    return (
      <section id="results" className="px-4 pb-16">
        <div className="max-w-4xl mx-auto text-center py-12 bg-white rounded-2xl border border-warm-200">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-brand-800 mb-2">No perfect matches found</h2>
          <p className="text-warm-600">Try adjusting your info. Some programs have very specific requirements.</p>
        </div>
      </section>
    );
  }

  const badgeColors = {
    'Strong': 'bg-leaf-100 text-leaf-600',
    'Good': 'bg-brand-100 text-brand-600',
    'Maybe': 'bg-warm-100 text-warm-400'
  };

  return (
    <section id="results" className="px-4 pb-16">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-brand-800">We found programs that match your info</h2>
          <span className="text-sm text-warm-400">Showing {programs.length} programs</span>
        </div>

        <div className="space-y-4">
          {programs.map((program, idx) => {
            const programId = program.program_id || program.id || `prog-${idx}`;
            return (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-warm-200 p-6 hover:shadow-md transition-shadow animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl p-3 bg-brand-50 rounded-xl">
                  {program.program_name.includes('Dream') ? '🏡' : 
                   program.program_name.includes('Down Payment') ? '💵' :
                   program.program_name.includes('Remodel') ? '🔨' :
                   program.program_name.includes('Grant') ? '🏠' : '🏘️'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`${badgeColors[program.matchStrength]} text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1`}>
                      <Star size={12} fill="currentColor" /> {program.matchStrength} Match
                    </span>
                    <span className="bg-warm-100 text-warm-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {program.category || 'Program'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-brand-800">{program.program_name}</h3>
                </div>
              </div>

              <p className="text-warm-600 text-sm leading-relaxed mb-6">{program.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs font-medium text-warm-400 uppercase tracking-wider mb-0.5">Yearly income limit</p>
                  <p className="text-sm font-medium text-warm-800">
                    {verificationStates[programId]?.resultData?.verified_income_limit ? (
                      <span className="text-leaf-600 font-bold">
                        ${verificationStates[programId].resultData.verified_income_limit.toLocaleString()}*
                      </span>
                    ) : (
                      typeof program.income_limits === 'string' ? program.income_limits : 'Varies by county'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-warm-400 uppercase tracking-wider mb-0.5">Home price limit</p>
                  <p className="text-sm font-medium text-warm-800">
                    {verificationStates[programId]?.resultData?.verified_price_cap ? (
                      <span className="text-leaf-600 font-bold">
                        ${verificationStates[programId].resultData.verified_price_cap.toLocaleString()}*
                      </span>
                    ) : (
                      typeof program.purchase_price_limits === 'string' ? program.purchase_price_limits : 'Varies by county'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-warm-400 uppercase tracking-wider mb-0.5">Counties served</p>
                  <p className="text-sm font-medium text-warm-800">{program.counties_served}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-warm-400 uppercase tracking-wider mb-0.5">Home type</p>
                  <p className="text-sm font-medium text-warm-800">{program.property_type_eligibility}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-warm-100">
                <div className="flex-1 flex flex-wrap items-center gap-4">
                  <a 
                    href={program.official_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand-500 hover:text-brand-600 font-medium text-sm flex items-center gap-1 transition"
                  >
                    Official Website <ExternalLink size={14} />
                  </a>

                  {/* Live Verify Button / Status */}
                  <div className="flex items-center">
                    {verificationStates[programId] ? (
                      <div className="flex items-center gap-3">
                        {verificationStates[programId].status === 'pending' ? (
                          <span className="inline-flex items-center gap-2 text-brand-600 text-sm font-medium animate-pulse">
                            <RefreshCw size={14} className="animate-spin" /> Verifying...
                          </span>
                        ) : verificationStates[programId].status === 'verified' ? (
                          <div className="flex flex-col">
                            <span className="inline-flex items-center gap-1.5 text-leaf-600 text-sm font-bold bg-leaf-50 px-2 py-0.5 rounded-md">
                              <CheckCircle size={14} /> Live Verified
                            </span>
                            <span className="text-[10px] text-warm-400 mt-0.5">
                              Checked {verificationStates[programId].resultData?.timestamp || 'Just now'}
                            </span>
                            {verificationStates[programId].resultData?.source_url && (
                              <a 
                                href={verificationStates[programId].resultData.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-brand-400 underline hover:text-brand-500"
                              >
                                View Source
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-amber-600 text-sm font-medium bg-amber-50 px-2 py-0.5 rounded-md">
                            <AlertCircle size={14} /> Not Eligible (Live)
                          </span>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => onVerifyLive(programId)}
                        className="inline-flex items-center gap-2 text-warm-500 hover:text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-transparent hover:border-brand-200"
                      >
                        <RefreshCw size={14} /> Verify Live Now
                      </button>
                    )}
                  </div>

                  {/* Lender CTA */}
                  <button 
                    onClick={() => onLenderClick(program.program_name)}
                    className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold text-sm transition px-2 py-1 rounded-md hover:bg-brand-50"
                  >
                    <Building2 size={14} /> Talk to a Specialist
                  </button>
                </div>

                <a 
                  href={program.official_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-leaf-500 hover:bg-leaf-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
                >
                  Apply for This
                </a>
              </div>
            </div>
          );
          })}
        </div>

        {/* Save button */}
        {!isAdminView && (
          <div className="mt-12 text-center">
            <button 
              onClick={onSaveClick}
              className="inline-flex items-center gap-2 bg-white border-2 border-brand-200 hover:border-brand-400 text-brand-800 px-8 py-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
            >
              💾 Save My Results
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultsList;
