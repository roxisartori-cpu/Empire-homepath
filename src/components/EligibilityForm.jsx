import React from 'react';
import { NY_COUNTIES } from '../counties';

const EligibilityForm = ({ formData, handleInputChange, handleSubmit, isSearching }) => {
  return (
    <section id="form" style={{ padding: '0 20px 48px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div className="card-dark card-dark-pad">
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--white)', marginBottom: '4px' }}>Tell us about you</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '28px' }}>We'll match you with programs you may qualify for.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* County */}
            <div className="form-row">
              <div className="field-group">
                <label htmlFor="county" className="field-label">County you're looking in</label>
                <div className="select-wrap">
                  <select
                    id="county"
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    className="field-select"
                    required
                  >
                    <option value="">Select a county...</option>
                    {NY_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="field-group">
                <label htmlFor="city" className="field-label">City / Town (optional)</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Buffalo, Albany"
                  className="field-input"
                />
              </div>
            </div>

            {/* Household income */}
            <div className="field-group">
              <label htmlFor="income" className="field-label">Your household income</label>
              <div className="field-prefix-wrap">
                <span className="field-prefix">$</span>
                <input
                  type="number"
                  id="income"
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  placeholder="Your household income before taxes"
                  className="field-input"
                />
              </div>
              <p className="field-hint">
                <span title="Include all earners in your household before taxes">💡</span>
                Include all earners in your household before taxes
              </p>
            </div>

            {/* Purchase price */}
            <div className="field-group">
              <label htmlFor="purchasePrice" className="field-label">Price of the home you're looking at</label>
              <div className="field-prefix-wrap">
                <span className="field-prefix">$</span>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  placeholder="Approximate price"
                  className="field-input"
                />
              </div>
            </div>

            {/* Property type */}
            <div className="field-group">
              <label className="field-label">Type of home</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
                    className={`pill-toggle ${formData.propertyType === type.value ? 'is-active' : ''}`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* First-time buyer */}
            <div className="field-group">
              <label className="field-label">Is this your first time buying a home?</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'isFirstTimeBuyer', value: opt.value } })}
                    className={`pill-toggle ${formData.isFirstTimeBuyer === opt.value ? 'is-active' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Veteran status */}
            <div className="field-group">
              <label className="field-label">Have you served in the military?</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'isVeteran', value: opt.value } })}
                    className={`pill-toggle ${formData.isVeteran === opt.value ? 'is-active' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Interests */}
            <div className="field-group" style={{ paddingTop: '4px' }}>
              <label className="field-label" style={{ marginBottom: '6px' }}>Optional: Are you interested in any of these?</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label className="check-row">
                  <input
                    type="checkbox"
                    name="isInterestedInRenovation"
                    checked={formData.isInterestedInRenovation}
                    onChange={handleInputChange}
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                  />
                  <div className={`check-box ${formData.isInterestedInRenovation ? 'is-checked' : ''}`}>
                    {formData.isInterestedInRenovation && '✓'}
                  </div>
                  <span className="check-label">Fixing up a home that needs repairs (Renovation)</span>
                </label>

                <label className="check-row">
                  <input
                    type="checkbox"
                    name="isInterestedInEnergy"
                    checked={formData.isInterestedInEnergy}
                    onChange={handleInputChange}
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                  />
                  <div className={`check-box ${formData.isInterestedInEnergy ? 'is-checked' : ''}`}>
                    {formData.isInterestedInEnergy && '✓'}
                  </div>
                  <span className="check-label">Energy-saving upgrades (Solar, Insulation, etc.)</span>
                </label>

                <label className="check-row">
                  <input
                    type="checkbox"
                    name="isInterestedInAccessibility"
                    checked={formData.isInterestedInAccessibility}
                    onChange={handleInputChange}
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                  />
                  <div className={`check-box ${formData.isInterestedInAccessibility ? 'is-checked' : ''}`}>
                    {formData.isInterestedInAccessibility && '✓'}
                  </div>
                  <span className="check-label">Modifications for disabilities (Accessibility)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="btn-gold"
              style={{ width: '100%' }}
            >
              {isSearching ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(10,22,40,0.3)', borderTopColor: 'var(--ink-deep)', borderRadius: '50%', animation: 'app-spin 0.8s linear infinite' }}></div>
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
