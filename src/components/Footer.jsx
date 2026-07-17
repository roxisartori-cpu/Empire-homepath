import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--ink-deep)', borderTop: '1px solid var(--border)', padding: '48px 16px', marginTop: '48px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '20px', color: 'var(--white)', fontWeight: 700, fontSize: '17px' }}>
          Empire <span style={{ color: 'var(--gold)' }}>HomePath</span>
        </div>
        <p style={{ marginBottom: '12px', maxWidth: '440px', margin: '0 auto 12px', neHeight: 1.7, color: 'var(--body-c)' }}>
          Supporting New Yorkers on their journey to homeownership with clarity, care, and jargon-free guidance.
        </p>
        <p style={{ marginBottom: '28px', color: 'var(--muted)' }}>
          Not affiliated with NY State government. Always verify with official program administrators.
        </p>
        <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--muted)' }}>
          &copy; {new Date().getFullYear()} Empire HomePath. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
