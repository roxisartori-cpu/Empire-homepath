import React, { useState, useMemo, useEffect } from 'react';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import EligibilityForm from './components/EligibilityForm';
import ResultsList from './components/ResultsList';
import SaveResults from './components/SaveResults';
import LenderModal from './components/LenderModal';
import Glossary from './components/Glossary';
import Checklist from './components/Checklist';
import Footer from './components/Footer';

import { matchPrograms } from './matching';
import programsData from './data/programs.json';

function App() {
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

  const matchedPrograms = useMemo(() => {
    if (!showResults) return [];
    return matchPrograms(programsData, formData);
  }, [formData, showResults]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  // Poll for verification updates
  useEffect(() => {
    const pendingRequests = Object.values(verificationStates).filter(v => v.status === 'pending');
    if (pendingRequests.length === 0) return;

    const interval = setInterval(async () => {
      for (const programId in verificationStates) {
        const state = verificationStates[programId];
        if (state.status === 'pending') {
          try {
            const res = await fetch(`${API_BASE_URL}/api/status/${state.requestId}`);
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
  }, [verificationStates]);

  const handleVerifyLive = async (programId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    
    // Simulate a brief search delay for better UX
    setTimeout(() => {
      setShowResults(true);
      setIsSearching(false);
      
      // Scroll to results
      setTimeout(() => {
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-warm-50 text-warm-800 font-sans">
      <NavBar />
      
      <main>
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
          />
        )}

        <Glossary />
        
        <Checklist />
      </main>

      <Footer />

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
    </div>
  );
}

export default App;
