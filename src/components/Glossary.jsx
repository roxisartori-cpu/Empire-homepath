import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import appContent from '../data/app_content.json';

const Glossary = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="glossary" style={{ padding: '64px 16px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="auth-eyebrow" style={{ justifyContent: 'center' }}>Reference</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--white)' }}>Common terms, plain English</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '8px' }}>No mortgage industry jargon — just clear explanations.</p>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solidar(--border)' }}>
          {appContent.glossary.map((item, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: i < appContent.glossary.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <button
                onClick={() => toggleAccordion(i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  padding: '16px 0',
                  fontWeight: 600,
                  color: 'var(--white)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Inter',sans-serif",
                  fontSize: '15px',
                }}
              >
                <span>{item.term}</span>
                <ChevronDown
                  size={18}
                  style={{
                    color: 'var(--gold)',
                    transition: 'transform 0.3s',
                    transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    flexShrink: 0,
                  }}
                />
              </button>
              <div style={{
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out',
                maxHeight: openIndex === i ? '200px' : '0px',
              }}>
                <p style={{ color: 'var(--body-c)', fontSize: '13px', lineHeight: 1.7, paddingBottom: '24px', paddingRight: '32px' }}>
                  {item.definition}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Glossary;
