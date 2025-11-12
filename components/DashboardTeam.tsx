import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Team } from '../types';
import { UsersIcon, CopyIcon, CheckCircleIcon, EyeIcon, UserCircleIcon } from './IconComponents';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';

const MemberCard: React.FC<{ member: Team['leader'], isLeader: boolean }> = ({ member, isLeader }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg flex items-center space-x-4 relative">
        {isLeader && (
            <div className="absolute -top-2 left-3 px-2 py-0.5 text-xs font-bold text-cyan-300 bg-cyan-900/80 border border-cyan-500/50 rounded-full">
                LEADER
            </div>
        )}
        {member.profilePictureUrl ? (
            <img src={member.profilePictureUrl} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-600"/>
        ) : (
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                <UserCircleIcon className="w-10 h-10 text-slate-500" />
            </div>
        )}
        <div className="flex-grow">
            <h4 className="font-bold text-white">{member.name}</h4>
            <p className="text-sm text-slate-400">{member.email}</p>
            {member.skills && member.skills.length > 0 && (
                 <div className="flex flex-wrap gap-1 mt-2">
                    {member.skills.map(skill => (
                        <span key={skill} className="bg-cyan-500/10 text-cyan-300 text-xs font-semibold px-2 py-0.5 rounded-full">{skill}</span>
                    ))}
                </div>
            )}
        </div>
    </div>
);

const DashboardTeam: React.FC<{ team: Team }> = ({ team }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isIdCopied, setIsIdCopied] = useState(false);

    const handleCopyId = () => {
        navigator.clipboard.writeText(team.id);
        setIsIdCopied(true);
        setTimeout(() => setIsIdCopied(false), 2000);
    };

    // Add defensive check
    if (!team || !team.leader) {
        return <div className="text-white">Loading team data...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                 <h1 className="text-3xl font-bold flex items-center"><UsersIcon className="w-8 h-8 mr-3 text-cyan-400"/> My Team</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#100D1C]/50 border border-purple-800/60 p-6 rounded-xl">
                    <label className="text-sm text-slate-400">Team ID</label>
                    <div className="flex items-center mt-1">
                        <span className="font-mono text-lg bg-slate-700 px-3 py-1 rounded text-white flex-grow">{team.id}</span>
                        <button onClick={handleCopyId} className="p-2 ml-2 text-slate-400 hover:text-white transition-colors">
                            {isIdCopied ? <CheckCircleIcon className="w-5 h-5 text-green-400"/> : <CopyIcon className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>
                <div className="bg-[#100D1C]/50 border border-purple-800/60 p-6 rounded-xl">
                     <label className="text-sm text-slate-400">Login Password</label>
                     <div className="flex items-center mt-1">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={isPasswordVisible ? 'visible' : 'hidden'}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="font-mono text-lg bg-slate-700 px-3 py-1 rounded text-white flex-grow tracking-wider"
                            >
                                {isPasswordVisible ? (team.password || 'N/A') : '••••••••'}
                            </motion.span>
                        </AnimatePresence>
                        <button onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="p-2 ml-2 text-slate-400 hover:text-white">
                            <EyeIcon className="w-5 h-5"/>
                        </button>
                     </div>
                </div>
            </div>
            
            <div className="space-y-4">
                <MemberCard member={team.leader} isLeader={true} />
                {team.members.map((member, index) => (
                    <MemberCard key={index} member={member} isLeader={false} />
                ))}
            </div>
        </div>
    );
};

export default DashboardTeam;