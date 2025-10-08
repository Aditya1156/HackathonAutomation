import React from 'react';
import { motion } from 'framer-motion';
import type { Team } from '../types';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';
import DashboardProgress from './DashboardProgress';
import DashboardAnnouncements from './DashboardAnnouncements';
import { DollarSignIcon, CheckCircleIcon, UserCircleIcon } from './IconComponents';

interface DashboardOverviewProps {
  team: Team;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; valueColor?: string }> = ({ title, value, icon, valueColor = 'text-white' }) => (
    <motion.div variants={fadeInUp} className="bg-[#100D1C]/50 border border-purple-800/60 p-4 rounded-xl backdrop-blur-sm flex items-center space-x-4">
       <div className="bg-slate-800/50 p-3 rounded-lg text-cyan-400">{icon}</div>
       <div>
           <p className="text-sm text-slate-400">{title}</p>
           <p className={`font-bold text-lg ${valueColor}`}>{value}</p>
       </div>
   </motion.div>
)

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ team }) => {
  const mockMentor = { name: 'Dr. Evelyn Reed' };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl md:text-4xl font-bold font-orbitron">
            Welcome, <span className="text-cyan-400 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">{team.name}</span>
        </h1>
        <p className="text-slate-400 mt-1">Here is your mission control for the hackathon.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           <StatCard 
                title="Payment Status" 
                value={team.paymentStatus || 'Pending'} 
                icon={<DollarSignIcon className="w-6 h-6"/>}
                valueColor={team.paymentStatus === 'Paid' ? 'text-green-400' : 'text-amber-400'}
            />
            <StatCard title="Submission" value={team.submission ? "Submitted" : "Pending"} icon={<CheckCircleIcon className="w-6 h-6"/>} />
            <StatCard title="Assigned Mentor" value={mockMentor.name} icon={<UserCircleIcon className="w-6 h-6"/>} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardProgress />
        </div>
        <div>
          <DashboardAnnouncements />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;