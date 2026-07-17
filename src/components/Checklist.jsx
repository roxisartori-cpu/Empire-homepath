import React, { useState, useEffect } from 'react';
import appContent from '../data/app_content.json';

const Checklist = () => {
  const [checklistState, setChecklistState] = useState(() => {
    const saved = localStorage.getItem('eh_checklist');
    if (saved) return JSON.parse(saved);

    const initialState = {};
    appContent.checklist.forEach(category => {
      category.items.forEach(item => {
        initialState[item.task] = false;
      });
    });
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('eh_checklist', JSON.stringify(checklistState));
  }, [checklistState]);

  const toggleItem = (task) => {
    setChecklistState(prev => ({
      ...prev,
      [task]: !prev[task]
    }));
  };

  const resetChecklist = () => {
    const resetState = {};
    Object.keys(checklistState).forEach(key => {
      resetState[key] = false;
    });
    setChecklistState(resetState);
  };

  const totalItems = Object.keys(checklistState).length;
  const completedItems = Object.values(checklistState).filter(Boolean).length;
  const progressPercentage = (completedItems / totalItems) * 100;

  return (
    <section id="checklist" style={{ padding: '64px 16px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div className="card-dark card-dark-pad">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div className="auth-eyebrow">Checklist</div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>Empire HomePath Readiness Checklist</h2>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {completedItems}/{totalItems} done
            </span>
          </div>

          <div style={{ height: '8px', background: 'var(--ink-lift)', borderRadius: '999px', overflow: 'hidden', marginBottom: '32px' }}>
            <div
              style={{
                height: '100%',
                background: 'var(--gold)',
                borderRadius: '999px',
                transition: 'width 0.5s ease-out',
                width: `${progressPercentage}%`,
              }}
            ></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {appContent.checklist.map((category, idx) => (
              <div key={idx}>
                <h3 style={{
                  fontSize: '11px',
                  fontFamily: "'DM Mono',monospace",
                  fontWeight: 500,
                  color: 'var(--gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '16px',
                  opacity: 0.85,
                }}>
                  {category.category}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {category.items.map((item, itemIdx) => (
                    <label key={itemIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={checklistState[item.task] || false}
                        onChange={() => toggleItem(item.task)}
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                      />
                      <div className={`check-box ${checklistState[item.task] ? 'is-checked' : ''}`} style={{ marginTop: '2px', flexShrink: 0 }}>
                        {checklistState[item.task] && '✓'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: checklistState[item.task] ? 'var(--muted)' : 'var(--white)' }}>
                          {item.task}
                        </span>
                        <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.6 }}>
                          {item.dails}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={resetChecklist}
            style={{
              marginTop: '32px',
              fontSize: '13px',
              color: 'var(--muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: "'Inter',sans-serif",
            }}
          >
            Reset my progress
          </button>
        </div>
      </div>
    </section>
  );
};

export default Checklist;
