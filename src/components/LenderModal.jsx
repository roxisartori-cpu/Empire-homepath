import React, { useState } from 'react';
import { X, Send, Phone, Mail, Building2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const LenderModal = ({ isOpen, onClose, programName, apiUrl }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'email',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/lender-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          program_name: programName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up">
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-warm-400 hover:text-warm-600 hover:bg-warm-100 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left side - Info */}
            <div className="md:col-span-2 bg-brand-50 p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  <Building2 className="text-brand-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-brand-900 mb-2 leading-tight">
                  Expert Guidance
                </h2>
                <p className="text-warm-600 text-sm mb-6 leading-relaxed">
                  Connect with a specialist who understands <span className="font-semibold text-brand-700">{programName}</span> and other New York assistance programs.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-leaf-100 rounded-full text-leaf-600">
                      <CheckCircle2 size={12} />
                    </div>
                    <p className="text-xs text-warm-700 font-medium">Free consultation</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-leaf-100 rounded-full text-leaf-600">
                      <CheckCircle2 size={12} />
                    </div>
                    <p className="text-xs text-warm-700 font-medium">Lender matched to your area</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-leaf-100 rounded-full text-leaf-600">
                      <CheckCircle2 size={12} />
                    </div>
                    <p className="text-xs text-warm-700 font-medium">No impact on credit score</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-brand-100">
                <p className="text-[10px] text-warm-400 uppercase tracking-widest font-bold mb-3">Partner Lenders</p>
                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-1 bg-white rounded-lg border border-brand-100 text-[10px] font-semibold text-brand-600 shadow-sm">
                    Empire HomePath Partners
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="md:col-span-3 p-8">
              {!submitted ? (
                <>
                  <h3 className="text-xl font-bold text-brand-800 mb-6">Inquire about this program</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-warm-500 uppercase tracking-wider ml-1">Full Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-3 rounded-xl border border-warm-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-warm-50/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-warm-500 uppercase tracking-wider ml-1">Email</label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="jane@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-warm-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-warm-50/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-warm-500 uppercase tracking-wider ml-1">Phone</label>
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(555) 000-0000"
                          className="w-full px-4 py-3 rounded-xl border border-warm-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-warm-50/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-warm-500 uppercase tracking-wider ml-1">Any specific questions?</label>
                      <textarea
                        rows="3"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="I'm curious about the income limits..."
                        className="w-full px-4 py-3 rounded-xl border border-warm-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-warm-50/30 resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/20 active:scale-[0.98] mt-2"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Send size={18} />
                      )}
                      {loading ? 'Submitting...' : 'Connect Me with a Specialist'}
                    </button>
                    <p className="text-[10px] text-center text-warm-400 px-4">
                      By clicking, you agree to be contacted by an Empire HomePath partner specialist. We never sell your data to third parties.
                    </p>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-20 h-20 bg-leaf-100 rounded-full flex items-center justify-center text-leaf-600 mb-2 animate-bounce-slow">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-900">Request Sent!</h3>
                  <p className="text-warm-600 leading-relaxed max-w-xs mx-auto">
                    A specialist who knows the <span className="font-semibold text-brand-700">{programName}</span> has been notified and will reach out to you within 24 hours.
                  </p>
                  <button 
                    onClick={onClose}
                    className="text-brand-600 font-bold hover:underline pt-4"
                  >
                    Back to results
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LenderModal;
