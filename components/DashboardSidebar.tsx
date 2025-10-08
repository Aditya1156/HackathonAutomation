import React from 'react';
import { motion } from 'framer-motion';
import { HomeIcon, UsersIcon, BookOpenIcon, ChatBubbleIcon, ClipboardCheckIcon } from './IconComponents';
import { DashboardView } from '../pages/DashboardPage';

interface DashboardSidebarProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
}

const navItems = [
  { view: 'overview' as const, label: 'Overview', icon: <HomeIcon className="w-6 h-6" /> },
  { view: 'team' as const, label: 'My Team', icon: <UsersIcon className="w-6 h-6" /> },
  { view: 'project' as const, label: 'Project Hub', icon: <BookOpenIcon className="w-6 h-6" /> },
  { view: 'chat' as const, label: 'Mentor Chat', icon: <ChatBubbleIcon className="w-6 h-6" /> },
  { view: 'resources' as const, label: 'Resources', icon: <ClipboardCheckIcon className="w-6 h-6" /> },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeView, setActiveView }) => {
  return (
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
      </div>
    </aside>
  );
};

export default DashboardSidebar;