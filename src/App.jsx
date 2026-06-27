import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import EligibilityForm from './components/EligibilityForm';
import ResultsList from './components/ResultsList';
import SaveResults from './components/SaveResults';
import LenderModal from './components/LenderModal';
import Glossary from './components/Glossary';
import Checklist from './components/Checklist';
import Footer from './components/Footer';
import Auth from './components/Auth';
import SubscriptionPaywall from './components/SubscriptionPaywall';
import AdminDashboard from './components/AdminDashboard';
import WhiteLabelSettings from './components/WhiteLabelSettings';
import ProfessionalDashboard from './components/ProfessionalDashboard';
import PdfReport from './components/report/PdfReport';
import WidgetEmbed from './pages/WidgetEmbed';
import LandingPage from './pages/LandingPage';

import { matchPrograms } from './matching';
import programsData from './data/programs.json';

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!token);
  const [currentView, setCurrentView] = useState('app'); // 'app', 'admin', 'branding'

  const isWidgetRoute = location.pathname === '/widget/embed';
  const isReportRoute = location.pathname === '/report';
  const isLandingRoute = location.pathname === '/';

  const brandingStyles = useMemo(() => {
    if (user?.plan !== 'white-label' || !user?.white_label_settings) return null;
    try {
      return typeof user.white_label_settings === 'string' 
        ? JSON.parse(user.white_label_settings) 
        : user.white_label_settings;
    } catch (e) {
      return null;
    }
  }, [user]);

  const [formData, setFormData] = useState({
    county: '',
    city: '',
    income: '',
    householdSize: 2,
    purchasePrice: '',
    propertyType: 'Single Family',
    isFirstTimeBuyer: true,
    isVeteran: false,
    isInterestedInRenovation: false,
    isInterestedInEnergy: false,
    isInterestedInAccessibility: false
  });

  const [showResults, setShowResults] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLenderModalOpen, setIsLenderModalOpen] = useState(false);
  const [selectedProgramForLender, setSelectedProgramForLender] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [verificationStates, setVerificationStates] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  // Fetch user profile if token exists
  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/api/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Session expired');
        return res.json();
      })
      .then(userData => {
        setUser(userData);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setLoading(false);
      });
    }
  }, [token]);

  const handleAuthSuccess = (data) => { console.log('Login success:', data.user.email);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setShowResults(false);
  };

  const matchedPrograms = useMemo(() => {
    if (!showResults) return [];
    return matchPrograms(programsData, formData);
  }, [formData, showResults]);

  // Poll for verification updates
  useEffect(() => {
    const pendingRequests = Object.values(verificationStates).filter(v => v.status === 'pending');
    if (pendingRequests.length === 0) return;

    const interval = setInterval(async () => {
      for (const programId in verificationStates) {
        const state = verificationStates[programId];
        if (state.status === 'pending') {
          try {
            const res = await fetch(`${API_BASE_URL}/api/status/${state.requestId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              if (data.status !== 'pending') {
                setVerificationStates(prev => ({
                  ...prev,
                  [programId]: {
                    ...prev[programId],
                    status: data.status,
                    resultData: data.result_data,
                    updatedAt: data.updated_at
                  }
                }));
              }
            }
          } catch (err) {
            console.error('Failed to poll status:', err);
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [verificationStates, token]);

  const handleVerifyLive = async (programId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          program_id: programId,
          user_data: {
            county: formData.county,
            city: formData.city,
            income: formData.income,
            householdSize: formData.householdSize,
            purchasePrice: formData.purchasePrice
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setVerificationStates(prev => ({
          ...prev,
          [programId]: { status: 'pending', requestId: data.id }
        }));
      }
    } catch (err) {
      console.error('Failed to trigger verification:', err);
    }
  };

  const handleLenderClick = (programName) => {
    setSelectedProgramForLender(programName);
    setIsLenderModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'income' || name === 'purchasePrice' || name === 'householdSize' ? (value === '' ? '' : Number(value)) : value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      setShowResults(true);
      setIsSearching(false);
      
      setTimeout(() => {
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isSubscribed = useMemo(() => {
    if (user?.role === 'admin') return true;
    if (user?.subscription_status === 'active') return true;
    if (user?.subscription_status === 'trialing') {
      if (!user.trial_end) return true;
      return new Date(user.trial_end) > new Date();
    }
    return false;
  }, [user]);

  return (
    <div className="min-h-screen bg-warm-50 text-warm-800 font-sans">
      {!isWidgetRoute && !isReportRoute && brandingStyles && (
        <style>{`
          :root {
            --brand-primary: ${brandingStyles.primaryColor};
            --brand-secondary: ${brandingStyles.secondaryColor};
          }
          .text-brand-600, .text-brand-700, .text-brand-800, .text-brand-900 { color: var(--brand-primary) !important; }
          .bg-brand-600, .bg-brand-700, .bg-brand-800 { background-color: var(--brand-primary) !important; }
          .border-brand-500, .border-brand-600 { border-color: var(--brand-primary) !important; }
          .focus\\:ring-brand-400:focus { --tw-ring-color: var(--brand-primary) !important; }
          .from-brand-900 { --tw-gradient-from: var(--brand-primary) !important; }
        `}</style>
      )}
      
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report" element={<PdfReport />} />
          <Route path="/widget/embed" element={<WidgetEmbed />} />
          <Route path="/search" element={
            (!token || !user) ? (
              <Auth onAuthSuccess={handleAuthSuccess} />
            ) : (
              <>
                <NavBar user={user} onLogout={handleLogout} onViewChange={setCurrentView} currentView={currentView} />
                
                {!isSubscribed ? (
                  <SubscriptionPaywall user={user} />
                ) : currentView === 'admin' && user?.role === 'admin' ? (
                  <AdminDashboard />
                ) : currentView === 'branding' && user?.plan === 'white-label' ? (
                  <WhiteLabelSettings user={user} onUpdateUser={setUser} />
                ) : currentView === 'dashboard' ? (
                  <ProfessionalDashboard user={user} />
                ) : (
                  <>
                    {!showResults && <Hero />}
                    
                    <div className={showResults ? 'pt-8' : ''}>
                      <EligibilityForm 
                        formData={formData} 
                        handleInputChange={handleInputChange} 
                        handleSubmit={handleSubmit}
                        isSearching={isSearching}
                      />
                    </div>

                    {isSearching && (
                      <div className="max-w-4xl mx-auto px-4 py-12">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
                          <p className="text-warm-600 font-medium animate-pulse">Finding your programs...</p>
                        </div>
                      </div>
                    )}

                    {showResults && !isSearching && (
                      <ResultsList 
                        programs={matchedPrograms} 
                        onSaveClick={() => setIsSaveModalOpen(true)} 
                        verificationStates={verificationStates}
                        onVerifyLive={handleVerifyLive}
                        onLenderClick={handleLenderClick}
                        formData={formData}
                        user={user}
                      />
                    )}

                    <Glossary />
                    <Checklist />
                  </>
                )}
              </>
            )
          } />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      {!isWidgetRoute && !isReportRoute && !isLandingRoute && <Footer />}

      {!isWidgetRoute && !isReportRoute && !isLandingRoute && (
        <>
          <SaveResults 
            isOpen={isSaveModalOpen} 
            onClose={() => setIsSaveModalOpen(false)} 
            formData={formData}
          />

          <LenderModal
            isOpen={isLenderModalOpen}
            onClose={() => setIsLenderModalOpen(false)}
            programName={selectedProgramForLender}
            apiUrl={API_BASE_URL}
          />
        </>
      )}
    </div>
  );
}

export default App;
