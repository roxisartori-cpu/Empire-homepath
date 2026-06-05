import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-brand-50 to-white pt-16 pb-20 md:pt-24 md:pb-28 px-4">
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        <div className="text-5xl md:text-6xl mb-6 text-center">🏡</div>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-800 leading-tight mb-4 text-center">
          Find help buying your<br className="hidden sm:block" /> first home in New York with <strong>Empire HomePath</strong>
        </h1>
        <p className="text-base md:text-lg text-warm-600 max-w-prose mx-auto leading-relaxed mb-8 text-center">
          Answer a few quick questions to find programs that match your situation.
          <span className="hidden sm:inline"><br /></span>No jargon, no fine print. Just clear steps to help you get started.
        </p>
        <div className="flex justify-center">
          <a href="#form" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all active:scale-95">
            Start Your Search
            <span>→</span>
          </a>
        </div>
        <p className="mt-6 text-sm text-warm-400 text-center">✨ Trusted by homebuyers across all 62 NY counties</p>
      </div>
    </section>
  );
};

export default Hero;
