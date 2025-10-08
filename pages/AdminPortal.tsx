import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminDashboard from './AdminPage';
import TeamsPage from './MentorJudgePage';
import QRScanPage from './QRScanPage';
import SubmissionsPage from './SubmissionsPage';
import SettingsPage from './SettingsPage';
import { HomeIcon, UsersIcon, QrcodeIcon, ClipboardCheckIcon, CogIcon, ChevronDoubleLeftIcon } from '../components/IconComponents';

type AdminView = 'dashboard' | 'teams' | 'submissions' | 'scanner' | 'settings';

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

    const navItems: { view: AdminView; label: string; icon: ReactNode }[] = [
        { view: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
        { view: 'teams', label: 'Teams', icon: <UsersIcon className="w-6 h-6" /> },
        { view: 'submissions', label: 'Submissions', icon: <ClipboardCheckIcon className="w-6 h-6" /> },
        { view: 'scanner', label: 'QR Scanner', icon: <QrcodeIcon className="w-6 h-6" /> },
        { view: 'settings', label: 'Settings', icon: <CogIcon className="w-6 h-6" /> },
    ];

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard': return <AdminDashboard />;
            case 'teams': return <TeamsPage />;
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
                <div className="p-4 border-t border-purple-800/60">
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