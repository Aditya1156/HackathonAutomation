import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, UsersIcon, BookOpenIcon, ChatBubbleIcon, ClipboardCheckIcon, LogoutIcon, XIcon, ExclamationIcon } from './IconComponents';
import { DashboardView } from '../pages/DashboardPage';

interface DashboardSidebarProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  onLogout: () => void;
}

const navItems = [
  { view: 'overview' as const, label: 'Overview', icon: <HomeIcon className="w-6 h-6" /> },
  { view: 'team' as const, label: 'My Team', icon: <UsersIcon className="w-6 h-6" /> },
  { view: 'project' as const, label: 'Project Hub', icon: <BookOpenIcon className="w-6 h-6" /> },
  { view: 'chat' as const, label: 'Mentor Chat', icon: <ChatBubbleIcon className="w-6 h-6" /> },
  { view: 'resources' as const, label: 'Resources', icon: <ClipboardCheckIcon className="w-6 h-6" /> },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeView, setActiveView, onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <aside className="md:w-64 flex-shrink-0">
        <div className="sticky top-24 bg-[#100D1C]/50 border border-purple-800/60 p-4 rounded-xl backdrop-blur-sm">
          <h2 className="text-xs uppercase text-slate-500 font-bold px-3 mb-2">Dashboard</h2>
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.view}>
                <button
                  onClick={() => setActiveView(item.view)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 relative ${
                    activeView === item.view ? 'text-white' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  {activeView === item.view && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute inset-0 bg-cyan-500/20 rounded-lg border-l-2 border-cyan-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10 font-semibold">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="mt-6 pt-4 border-t border-purple-500/30">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <LogoutIcon className="w-6 h-6" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={cancelLogout}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#100D1C] border-2 border-rose-500/50 rounded-xl p-6 max-w-md w-full shadow-2xl shadow-rose-500/20"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-rose-500/20 p-3 rounded-full">
                  <ExclamationIcon className="w-8 h-8 text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-white font-orbitron">Confirm Logout</h3>
              </div>
              
              <p className="text-slate-300 mb-6">
                Are you sure you want to logout? You'll need your Team ID and password to login again.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;