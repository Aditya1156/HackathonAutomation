import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllTeams } from '../services/firebaseTeamService';
import { Team } from '../types';
import { UsersIcon, ClipboardCheckIcon, CheckCircleIcon, DownloadIcon, MegaphoneIcon, CertificateIcon } from '../components/IconComponents';
import { useCountUp } from '../hooks/useCountUp';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: number, color: string }> = ({ icon, title, value, color }) => {
    const animatedValue = useCountUp(value, 1500);
    return (
        <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -5, scale: 1.03 }}
            className="bg-[#100D1C]/50 border border-purple-800/60 p-6 rounded-xl flex items-center space-x-4 backdrop-blur-sm"
        >
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-400 text-sm">{title}</p>
                <p className="text-2xl font-bold text-white">{animatedValue}</p>
            </div>
        </motion.div>
    );
}

const SkeletonStatCard = () => (
    <div className="bg-[#100D1C]/50 border border-purple-800/60 p-6 rounded-xl flex items-center space-x-4">
        <div className="w-12 h-12 rounded-lg bg-slate-700 animate-skeleton-pulse"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-slate-700 animate-skeleton-pulse"></div>
            <div className="h-6 w-1/2 rounded bg-slate-700 animate-skeleton-pulse"></div>
        </div>
    </div>
);


const AdminDashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [teams, setTeams] = useState<Team[]>([]);
    const totalParticipants = teams.reduce((acc, team) => acc + team.members.length + 1, 0);
    const checkedInCount = teams.filter(team => team.status === 'Checked-in' || team.status === 'Verified').length;
    const submissionsCount = teams.filter(team => team.submission).length;
    
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setIsLoading(true);
                const fetchedTeams = await getAllTeams();
                setTeams(fetchedTeams);
            } catch (error) {
                console.error('Error fetching teams:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeams();
    }, []);

    const handleDownloadCSV = () => {
        const headers = ["ID", "Team Name", "Leader Name", "Leader Email", "Members Count"];
        const rows = teams.map(team => [
            team.id,
            `"${team.name.replace(/"/g, '""')}"`,
            team.leader.name,
            team.leader.email,
            team.members.length + 1
        ].join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "hackathon_teams.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBroadcast = () => {
        const message = prompt("Enter announcement message:");
        if (message) {
            alert(`Broadcasting to all teams: "${message}" (mock)`);
        }
    }

    const handleGenerateCertificates = () => {
        const teamCount = teams.length;
        if (window.confirm(`Are you sure you want to generate ${teamCount} certificates? This is a mock action.`)) {
            setTimeout(() => {
                alert(`Successfully generated mock PDF certificates for all ${teamCount} registered teams!`);
            }, 1500);
        }
    };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.h1 variants={fadeInUp} className="text-4xl font-bold mb-8">Dashboard</motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {isLoading ? (
            <>
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
            </>
        ) : (
            <>
                <StatCard icon={<UsersIcon className="w-6 h-6 text-white"/>} title="Total Teams" value={teams.length} color="bg-purple-500/80" />
                <StatCard icon={<UsersIcon className="w-6 h-6 text-white"/>} title="Total Participants" value={totalParticipants} color="bg-emerald-500/80" />
                <StatCard icon={<CheckCircleIcon className="w-6 h-6 text-white"/>} title="Check-ins" value={checkedInCount} color="bg-cyan-500/80" />
                <StatCard icon={<ClipboardCheckIcon className="w-6 h-6 text-white"/>} title="Submissions" value={submissionsCount} color="bg-rose-500/80" />
            </>
        )}
      </div>

      {/* Quick Actions */}
       {isLoading ? (
            <>
                <div className="text-2xl font-semibold mb-4 h-8 w-1/3 rounded bg-slate-700 animate-skeleton-pulse"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[#100D1C]/50 border border-purple-800/60 rounded-xl p-6 h-56 animate-skeleton-pulse"></div>
                    <div className="bg-[#100D1C]/50 border border-purple-800/60 rounded-xl p-6 h-56 animate-skeleton-pulse"></div>
                </div>
            </>
       ) : (
        <>
            <motion.h2 variants={fadeInUp} className="text-2xl font-semibold mb-4">Quick Actions</motion.h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div variants={fadeInUp} className="bg-[#100D1C]/50 border border-purple-800/60 rounded-xl p-6 backdrop-blur-sm flex flex-col">
                        <h3 className="text-lg font-bold mb-3 flex items-center"><MegaphoneIcon className="w-5 h-5 mr-2 text-amber-400" /> Broadcast Announcement</h3>
                        <textarea placeholder="Type your message to all participants..." rows={4} className="w-full p-2 bg-slate-800 border border-purple-500/30 rounded-md mb-3 flex-grow"></textarea>
                        <motion.button 
                            onClick={handleBroadcast} 
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors shadow-md"
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        >
                            <span>Send Broadcast</span>
                        </motion.button>
                    </motion.div>
                    
                    <motion.div variants={fadeInUp} className="bg-[#100D1C]/50 border border-purple-800/60 rounded-xl p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-bold mb-3">Reports & Actions</h3>
                        <div className="space-y-3">
                            <motion.button 
                                onClick={handleDownloadCSV} 
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg shadow-md"
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            >
                                <DownloadIcon className="w-5 h-5" />
                                <span>Download Teams CSV</span>
                            </motion.button>
                            <motion.button 
                                onClick={handleGenerateCertificates} 
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors shadow-md"
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            >
                                <CertificateIcon className="w-5 h-5" />
                                <span>Generate Certificates</span>
                            </motion.button>
                        </div>
                    </motion.div>
            </div>
        </>
       )}
    </motion.div>
  );
};

export default AdminDashboard;