import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminDashboard from './AdminPage';
import TeamsPage from './MentorJudgePage';
import QRScanPage from './QRScanPage';
import SubmissionsPage from './SubmissionsPage';
import SettingsPage from './SettingsPage';
import JuryPortal from './JuryPortal';
import AdminLogin from '../components/AdminLogin';
import { HomeIcon, UsersIcon, QrcodeIcon, ClipboardCheckIcon, CogIcon, ChevronDoubleLeftIcon, ScaleIcon } from '../components/IconComponents';
import { logoutUser, UserProfile } from '../services/firebaseAuthService';

type AdminView = 'dashboard' | 'teams' | 'submissions' | 'scanner' | 'settings' | 'jury';

const sidebarVariants = {
  expanded: { width: '250px' },
  collapsed: { width: '80px' },
};

const iconVariants = {
  expanded: { rotate: 0 },
  collapsed: { rotate: 180 },
};

const AdminPortal: React.FC = () => {
    const [currentView, setCurrentView] = useState<AdminView>('dashboard');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminUser, setAdminUser] = useState<UserProfile | null>(null);

    // Check if user is already logged in (for testing)
    useEffect(() => {
        const storedAuth = localStorage.getItem('adminAuth');
        if (storedAuth) {
            try {
                const user = JSON.parse(storedAuth);
                setAdminUser(user);
                setIsAuthenticated(true);
            } catch (e) {
                localStorage.removeItem('adminAuth');
            }
        }
    }, []);

    const handleLoginSuccess = () => {
        const storedAuth = localStorage.getItem('adminAuth');
        if (storedAuth) {
            const user = JSON.parse(storedAuth);
            setAdminUser(user);
            setIsAuthenticated(true);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem('adminAuth');
            setIsAuthenticated(false);
            setAdminUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Show login screen if not authenticated
    if (!isAuthenticated) {
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    const navItems: { view: AdminView; label: string; icon: ReactNode }[] = [
        { view: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
        { view: 'teams', label: 'Teams', icon: <UsersIcon className="w-6 h-6" /> },
        { view: 'jury', label: 'Jury Portal', icon: <ScaleIcon className="w-6 h-6" /> },
        { view: 'submissions', label: 'Submissions', icon: <ClipboardCheckIcon className="w-6 h-6" /> },
        { view: 'scanner', label: 'QR Scanner', icon: <QrcodeIcon className="w-6 h-6" /> },
        { view: 'settings', label: 'Settings', icon: <CogIcon className="w-6 h-6" /> },
    ];

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard': return <AdminDashboard />;
            case 'teams': return <TeamsPage />;
            case 'jury': return <JuryPortal />;
            case 'submissions': return <SubmissionsPage />;
            case 'scanner': return <QRScanPage />;
            case 'settings': return <SettingsPage />;
            default: return <AdminDashboard />;
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-140px)] bg-[#0D0B14]">
            <motion.nav
                animate={isSidebarExpanded ? 'expanded' : 'collapsed'}
                variants={sidebarVariants}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-[#100D1C]/50 border-r border-purple-800/60 flex flex-col justify-between"
            >
                <div>
                    {/* User Info */}
                    {isSidebarExpanded && adminUser && (
                        <div className="p-4 border-b border-purple-800/60">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {adminUser.displayName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold truncate">{adminUser.displayName}</p>
                                    <p className="text-xs text-slate-400 truncate">{adminUser.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Items */}
                    <ul className="space-y-2 p-4">
                        {navItems.map(item => (
                            <li key={item.view}>
                                <button
                                    onClick={() => setCurrentView(item.view)}
                                    className={`w-full flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 ${
                                        currentView === item.view
                                            ? 'bg-cyan-500/20 text-cyan-300'
                                            : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                    }`}
                                >
                                    {item.icon}
                                    <AnimatePresence>
                                        {isSidebarExpanded && (
                                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} exit={{ opacity: 0 }}>
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 border-t border-purple-800/60 space-y-2">
                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-4 p-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <AnimatePresence>
                            {isSidebarExpanded && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} exit={{ opacity: 0 }}>
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Collapse Button */}
                    <button
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        className="w-full flex items-center space-x-4 p-3 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white"
                    >
                        <motion.div animate={isSidebarExpanded ? 'expanded' : 'collapsed'} variants={iconVariants}>
                            <ChevronDoubleLeftIcon className="w-6 h-6" />
                        </motion.div>
                         <AnimatePresence>
                            {isSidebarExpanded && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} exit={{ opacity: 0 }}>
                                    Collapse
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.nav>
            <main className="flex-1 p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentView}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminPortal;