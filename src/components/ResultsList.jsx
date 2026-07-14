import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, RefreshCw, CheckCircle, AlertCircle, Building2, FileText } from 'lucide-react';

const ResultsList = ({ programs, onSaveClick, verificationStates = {}, onVerifyLive, onLenderClick, isAdminView = false, formData = {}, user = null }) => {
  const navigate = useNavigate();

  if (programs.length === 0) {
    return (
      <section id="results" style={{ padding: '0 20px 64px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div className="no-results">
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>🔍</div>
            <h2>No perfect matches found</h2>
            <p>Try adjusting your info. Some programs have very specific requirements.</p>
          </div>
        </div>
      </section>
    );
  }

  const handlePrintClick = () => {
    const formattedResults = programs.map(p => ({
      id: p.program_id || p.id,
      name: p.program_name,
      description: p.description,
      matchScore: p.matchStrength,
      incomeLimit: typeof p.income_limits === 'string' ? p.income_limits : 'Varies',
      priceLimit: typeof p.purchase_price_limits === 'string' ? p.purchase_price_limits : 'Varies',
      url: p.official_url
    }));

    navigate('/report', {
      state: {
        results: formattedResults,
        formData,
        user
      }
    });
  };

  const badgeClass = {
    'Strong': 'strong',
    'Good': 'good',
    'Maybe': 'maybe'
  };

  return (
    <section id="results" style={{ padding: '0 20px 64px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div className="results-header">
          <div>
            <h2 className="results-title">We found programs that match your info</h2>
            <span className="results-count">Showing {programs.length} programs</span>
          </div>
          <button onClick={handlePrintClick} className="btn-gold-outline" style={{ padding: '10px 20px', fontSize: '12px' }}>
            <FileText size={15} /> Generate PDF Report
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {programs.map((program, idx) => {
            const programId = program.program_id || program.id || `prog-${idx}`;
            return (
              <div key={idx} className="prog-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' }}>
                  <div className="prog-icon">
                    {program.program_name.includes('Dream') ? '🏡' :
                     program.program_name.includes('Down Payment') ? '💵' :
                     program.program_name.includes('Remodel') ? '🔨' :
                     program.program_name.includes('Grant') ? '🏠' : '🏘️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span className={`match-badge ${badgeClass[program.matchStrength]}`}>
                        ★ {program.matchStrength} Match
                      </span>
                      <span className="category-pill">{program.category || 'Program'}</span>
                    </div>
                    <h3 className="prog-name">{program.program_name}</h3>
                  </div>
                </div>

                <p className="prog-desc" style={{ marginBottom: '20px' }}>{program.description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <p className="prog-stat-label">Yearly income limit</p>
                    <p className={`prog-stat-value ${verificationStates[programId]?.resultData?.verified_income_limit ? 'green' : ''}`}>
                      {verificationStates[programId]?.resultData?.verified_income_limit ? (
                        <>${verificationStates[programId].resultData.verified_income_limit.toLocaleString()}*</>
                      ) : (
                        typeof program.income_limits === 'string' ? program.income_limits : 'Varies by county'
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="prog-stat-label">Home price limit</p>
                    <p className={`prog-stat-value ${verificationStates[programId]?.resultData?.verified_price_cap ? 'green' : ''}`}>
                      {verificationStates[programId]?.resultData?.verified_price_cap ? (
                        <>${verificationStates[programId].resultData.verified_price_cap.toLocaleString()}*</>
                      ) : (
                        typeof program.purchase_price_limits === 'string' ? program.purchase_price_limits : 'Varies by county'
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="prog-stat-label">Counties served</p>
                    <p className="prog-stat-value">{program.counties_served}</p>
                  </div>
                  <div>
                    <p className="prog-stat-label">Home type</p>
                    <p className="prog-stat-value">{program.property_type_eligibility}</p>
                  </div>
                </div>

                <div className="prog-footer" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                    <a href={program.official_url} target="_blank" rel="noopener noreferrer" className="prog-link">
                      Official Website <ExternalLink size={13} />
                    </a>

                    <div>
                      {verificationStates[programId] ? (
                        verificationStates[programId].status === 'pending' ? (
                          <span className="verify-pending"><RefreshCw size={13} className="animate-spin" /> Verifying...</span>
                        ) : verificationStates[programId].status === 'verified' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span className="verify-verified"><CheckCircle size={13} /> Live Verified</span>
                            <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                              Checked {verificationStates[programId].resultData?.timestamp || 'Just now'}
                            </span>
                            {verificationStates[programId].resultData?.source_url && (
                              <a href={verificationStates[programId].resultData.source_url} target="_blank" rel="noopener noreferrer" className="verify-source">
                                View Source
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="verify-notlive"><AlertCircle size={13} /> Not Eligible (Live)</span>
                        )
                      ) : (
                        <button onClick={() => onVerifyLive(programId)} className="verify-btn">
                          <RefreshCw size={13} /> Verify Live Now
                        </button>
                      )}
                    </div>

                    <button onClick={() => onLenderClick(program.program_name)} className="btn-specialist">
                      <Building2 size={13} /> Talk to a Specialist
                    </button>
                  </div>

                  <a href={program.official_url} target="_blank" rel="noopener noreferrer" className="btn-apply">
                    Apply for This
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        {!isAdminView && (
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px', width: '100%' }}>
              <button onClick={handlePrintClick} className="btn-gold" style={{ flex: '1 1 220px' }}>
                <FileText size={18} /> Generate PDF Report
              </button>
              <button onClick={onSaveClick} className="btn-gold-outline" style={{ flex: '1 1 220px' }}>
                💾 Save My Results
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultsList;
