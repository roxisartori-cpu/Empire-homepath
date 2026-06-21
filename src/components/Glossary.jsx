import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import appContent from '../data/app_content.json';

const Glossary = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="glossary" className="px-4 py-16 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">📖</div>
          <h2 className="text-2xl font-semibold text-brand-800">Common terms, plain English</h2>
          <p className="text-warm-400 text-sm mt-2">No mortgage industry jargon — just clear explanations.</p>
        </div>

        <div className="space-y-0 divide-y divide-warm-200 border-t border-b border-warm-200">
          {appContent.glossary.map((item, i) => (
            <div key={i} className="py-2">
              <button 
                className="w-full flex justify-between items-center text-left py-4 font-medium text-warm-800 hover:text-brand-600 transition group"
                onClick={() => toggleAccordion(i)}
              >
                <span className="group-hover:translate-x-1 transition-transform">{item.term}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-warm-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} 
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-48' : 'max-h-0'}`}>
                <p className="text-warm-600 text-sm leading-relaxed pb-6 pr-8">
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
