import React from 'react';
import { NY_COUNTIES } from '../counties';

const EligibilityForm = ({ formData, handleInputChange, handleSubmit, isSearching }) => {
  return (
    <section id="form" className="px-4 pb-12 -mt-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 animate-slide-up">
          <h2 className="text-xl font-semibold text-brand-800 mb-2">Tell us about you</h2>
          <p className="text-sm text-warm-400 mb-6">We'll match you with programs you may qualify for.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* County */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="county" className="block text-sm font-medium text-warm-600 mb-1.5">County you're looking in</label>
                <select 
                  id="county" 
                  name="county"
                  value={formData.county}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-white focus:ring-2 focus:ring-brand-400 focus:border-brand-400 text-warm-800 appearance-none" 
                  required
                >
                  <option value="">Select a county...</option>
                  {NY_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-warm-600 mb-1.5">City / Town (optional)</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Buffalo, Albany" 
                  className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-white focus:ring-2 focus:ring-brand-400 focus:border-brand-400 text-warm-800"
                />
              </div>
            </div>

            {/* Household income */}
            <div>
              <label htmlFor="income" className="block text-sm font-medium text-warm-600 mb-1.5">Your household income</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400 font-medium">$</span>
                <input 
                  type="number" 
                  id="income" 
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  placeholder="Your household income before taxes" 
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-warm-200 bg-white focus:ring-2 focus:ring-brand-400 focus:border-brand-400 text-warm-800"
                />
              </div>
              <p className="flex items-center gap-1 mt-1.5 text-xs text-warm-400">
                <span className="cursor-help" title="Include all earners in your household before taxes">💡</span>
                Include all earners in your household before taxes
              </p>
            </div>

            {/* Purchase price */}
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-warm-600 mb-1.5">Price of the home you're looking at</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400 font-medium">$</span>
                <input 
                  type="number" 
                  id="purchasePrice" 
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  placeholder="Approximate price" 
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-warm-200 bg-white focus:ring-2 focus:ring-brand-400 focus:border-brand-400 text-warm-800"
                />
              </div>
            </div>

            {/* Property type */}
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-2">Type of home</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '🏠 Single-family home', value: 'Single Family' },
                  { label: '🏢 Condo / Co-op', value: 'Condo/Co-op' },
                  { label: '🏘️ Townhouse', value: 'Townhouse' },
                  { label: '🏡 Multi-family (2-4 units)', value: '2-4 Unit' }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'propertyType', value: type.value } })}
                    className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                      formData.propertyType === type.value
                        ? 'bg-brand-100 border-brand-500 text-brand-800 font-medium'
                        : 'border-warm-200 hover:border-brand-400 text-warm-600'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* First-time buyer */}
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-2">Is this your first time buying a home?</label>
              <div className="flex gap-2">
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'isFirstTimeBuyer', value: opt.value } })}
                    className={`px-5 py-2.5 rounded-lg border transition-all text-sm ${
                      formData.isFirstTimeBuyer === opt.value
                        ? 'bg-brand-100 border-brand-500 text-brand-800 font-medium'
                        : 'border-warm-200 hover:border-brand-400 text-warm-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Veteran status */}
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-2">Have you served in the military?</label>
              <div className="flex gap-2">
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'isVeteran', value: opt.value } })}
                    className={`px-5 py-2.5 rounded-lg border transition-all text-sm ${
                      formData.isVeteran === opt.value
                        ? 'bg-brand-100 border-brand-500 text-brand-800 font-medium'
                        : 'border-warm-200 hover:border-brand-400 text-warm-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSearching}
              className={`w-full md:w-auto bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isSearching ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                'Find My Programs →'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EligibilityForm;
