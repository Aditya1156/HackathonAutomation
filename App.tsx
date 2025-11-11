
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Fix: Changed to a type-only import for better practice, which also helps clarify dependencies. The original error was due to an empty types.ts file.
import type { Team, Attraction } from './types';

import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import UserPortal from './pages/UserPortal';
import AdminPortal from './pages/AdminPortal';
import StudentLoginPage from './pages/StudentLoginPage';
import DashboardPage from './pages/DashboardPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import ScrollToTopButton from './components/ScrollToTopButton';
import { ToastProvider } from './hooks/useToast';
import ScrollFXContainer from './components/ScrollFXContainer';
import TargetCursor from './components/TargetCursor';
import ErrorBoundary from './components/ErrorBoundary';
import { modalBackdropVariants, modalContentVariants } from './animations/framerVariants';
import { InfoIcon, WandSparklesIcon, MapPinIcon, XIcon } from './components/IconComponents';

// New Attraction Modal Component, moved from LandingPage
const AttractionModal: React.FC<{ attraction: Attraction; onClose: () => void }> = ({ attraction, onClose }) => {
    const [activeTab, setActiveTab] = useState<'about' | 'activities' | 'travel'>('about');

    const tabs = [
        { id: 'about' as const, label: 'About', icon: <InfoIcon className="w-5 h-5" /> },
        { id: 'activities' as const, label: 'Activities', icon: <WandSparklesIcon className="w-5 h-5" /> },
        { id: 'travel' as const, label: 'Getting There', icon: <MapPinIcon className="w-5 h-5" /> }
    ];

    return (
        <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden"
            onClick={onClose}
        >
            <motion.div
                variants={modalContentVariants}
                className="relative bg-[#100D1C] w-full max-w-3xl rounded-xl border border-purple-500/50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <img src={attraction.imageUrl} alt={attraction.name} className="w-full h-64 object-cover" />
                <div className="p-8">
                    <h2 className="text-3xl font-bold font-orbitron text-white">{attraction.name}</h2>
                    <div className="my-4 border-b border-purple-500/30 flex space-x-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-cyan-400 text-cyan-400'
                                        : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="text-slate-300"
                        >
                            {activeTab === 'about' && <p>{attraction.longDescription}</p>}
                            {activeTab === 'activities' && (
                                <ul className="list-disc list-inside space-y-1">
                                    {attraction.activities.map(activity => <li key={activity}>{activity}</li>)}
                                </ul>
                            )}
                            {activeTab === 'travel' && <p>{attraction.gettingThere}</p>}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 bg-black/50 rounded-full hover:text-white"><XIcon className="w-6 h-6"/></button>
            </motion.div>
        </motion.div>
    );
};

// Function to initialize state from sessionStorage (tab session only)
const getInitialState = () => {
    try {
        if (typeof window === 'undefined') {
            return { initialMode: 'landing' as const, initialTeam: null };
        }
        
        const storedTeam = sessionStorage.getItem('activeTeam');
        
        if (storedTeam) {
            const parsedTeam = JSON.parse(storedTeam) as Team;
            if (parsedTeam && parsedTeam.id && parsedTeam.name) {
                return {
                    initialMode: 'student_dashboard' as const,
                    initialTeam: parsedTeam,
                };
            }
        }
    } catch (error) {
        console.error("Failed to parse stored team:", error);
        try {
            sessionStorage.removeItem('activeTeam');
            sessionStorage.removeItem('justRegistered');
        } catch (e) {
            console.error("Failed to clear storage:", e);
        }
    }
    return { initialMode: 'landing' as const, initialTeam: null };
};


const App: React.FC = () => {
  const { initialMode, initialTeam } = getInitialState();
  const [appMode, setAppMode] = useState<'landing' | 'user' | 'admin' | 'student_login' | 'student_dashboard' | 'registration_success'>(initialMode);
  const [activeTeam, setActiveTeam] = useState<Team | null>(initialTeam);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const isLoggingOut = React.useRef(false);

  // Effect to handle logout navigation
  useEffect(() => {
    if (isLoggingOut.current) {
      isLoggingOut.current = false;
      return;
    }
    
    if (!activeTeam && (appMode === 'student_dashboard' || appMode === 'registration_success')) {
      setAppMode('landing');
    }
    
    if (activeTeam && appMode !== 'student_dashboard' && appMode !== 'registration_success') {
      try {
        sessionStorage.removeItem('activeTeam');
        sessionStorage.removeItem('justRegistered');
      } catch (error) {
        console.error("Failed to clear storage:", error);
      }
      setActiveTeam(null);
    }
  }, [activeTeam, appMode]);

  const handleOpenAttractionModal = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
  };

  const handleCloseAttractionModal = () => {
    setSelectedAttraction(null);
  };

  useEffect(() => {
    if (selectedAttraction) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedAttraction]);

  const handleRegistrationComplete = (team: Team) => {
    try {
      sessionStorage.setItem('activeTeam', JSON.stringify(team));
    } catch (error) {
      console.error("Failed to save team:", error);
    }
    setActiveTeam(team);
    setAppMode('registration_success');
  };
  
  const handleNavigateToDashboard = () => {
    if (activeTeam) {
        try {
          sessionStorage.setItem('justRegistered', 'true');
        } catch (error) {
          console.error("Failed to set justRegistered flag:", error);
        }
        setAppMode('student_dashboard');
    } else {
        // Fallback in case activeTeam is somehow lost
        setAppMode('student_login');
    }
  };

  const handleLoginSuccess = (team: Team) => {
    try {
      sessionStorage.setItem('activeTeam', JSON.stringify(team));
    } catch (error) {
      console.error("Failed to save team:", error);
    }
    setActiveTeam(team);
    setAppMode('student_dashboard');
  };
  
  const handleLogout = () => {
    isLoggingOut.current = true;
    
    try {
      sessionStorage.removeItem('activeTeam');
      sessionStorage.removeItem('justRegistered');
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
    
    setActiveTeam(null);
    setAppMode('landing');
  }

  const handleSafeNavigation = (mode: 'landing' | 'user' | 'admin' | 'student_login' | 'student_dashboard' | 'registration_success') => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    if (activeTeam && (appMode === 'student_dashboard' || appMode === 'registration_success')) {
      if (mode !== 'student_dashboard' && mode !== 'registration_success') {
        handleLogout();
        setTimeout(() => {
          setAppMode(mode);
          setIsNavigating(false);
        }, 150);
        return;
      }
    }
    
    setAppMode(mode);
    setTimeout(() => setIsNavigating(false), 100);
  }

  const renderContent = () => {
    try {
      switch (appMode) {
        case 'user':
          return <UserPortal onRegistrationComplete={handleRegistrationComplete} />;
        case 'registration_success':
          if (!activeTeam) return <UserPortal onRegistrationComplete={handleRegistrationComplete} />;
          return <RegistrationSuccessPage team={activeTeam} onProceed={handleNavigateToDashboard} />;
        case 'admin':
          return <AdminPortal />;
        case 'student_login':
          return <StudentLoginPage onLoginSuccess={handleLoginSuccess} />;
        case 'student_dashboard':
          if (!activeTeam) return <StudentLoginPage onLoginSuccess={handleLoginSuccess} />;
          return <DashboardPage team={activeTeam} onLogout={handleLogout} />;
        case 'landing':
        default:
          return <LandingPage setAppMode={handleSafeNavigation} onAttractionClick={handleOpenAttractionModal} />;
      }
    } catch (error) {
      console.error("Error rendering content:", error);
      return <LandingPage setAppMode={handleSafeNavigation} onAttractionClick={handleOpenAttractionModal} />;
    }
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen font-sans">
          <TargetCursor spinDuration={4} hideDefaultCursor={true} />
          <Header setAppMode={handleSafeNavigation} onLogoClick={handleLogout} />
          <main className="page-container">
            <ScrollFXContainer>
              <AnimatePresence mode="wait">
                  <motion.div
                      key={appMode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                      {renderContent()}
                  </motion.div>
              </AnimatePresence>
            </ScrollFXContainer>
          </main>
          <Footer />
          <ScrollToTopButton />
          <AnimatePresence>
              {selectedAttraction && (
              <AttractionModal 
                  attraction={selectedAttraction} 
                  onClose={handleCloseAttractionModal} 
              />
              )}
        </AnimatePresence>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
