import React from 'react';

const Hero = () => {
  return (
    <section style={{ padding: '64px 16px 56px', textAlign: 'center' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ fontSize: 'clamp(38px,6vw,56px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '20px', color: 'var(--white)' }}>
          Empire <span style={{ color: 'var(--gold)' }}>HomePath</span>
        </div>
        <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '16px' }}>
          Find help buying your first home in New York
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--body-c)', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.7 }}>
          Answer a few quick questions to find programs that match your situation.
          No jargon, no fine print. Just clear steps to help you get started.
        </p>
        <a href="#form" className="btn-gold" style={{ display: 'inline-flex' }}>
          Start Your Search <span>→</span>
        </a>
        <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--muted)' }}>
          Trusted by homebuyers across all 62 NY counties
        </p>
      </div>
    </section>
  );
};

export default Hero;
