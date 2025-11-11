import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTeamsWithSubmissions } from '../services/firebaseTeamService';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';
import { BookOpenIcon, LinkIcon, TrophyIcon } from '../components/IconComponents';
import type { Team } from '../types';

const SkeletonSubmissionCard: React.FC = () => (
    <div className="bg-[#100D1C]/50 border border-purple-800/60 p-6 rounded-xl animate-skeleton-pulse">
        <div className="flex justify-between items-start">
            <div className="space-y-2">
                <div className="h-6 w-32 bg-slate-700 rounded"></div>
                <div className="h-4 w-24 bg-slate-700 rounded"></div>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-700"></div>
        </div>
        <div className="space-y-2 my-4">
            <div className="h-4 w-full bg-slate-700 rounded"></div>
            <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-500/30 flex justify-between items-center">
            <div className="h-6 w-36 bg-slate-700 rounded"></div>
            <div className="h-8 w-28 bg-slate-700 rounded-full"></div>
        </div>
    </div>
);

const SubmissionCard: React.FC<{ team: Team }> = ({ team }) => (
    <motion.div
        variants={fadeInUp}
        whileHover={{ y: -5, scale: 1.02 }}
        className="glowing-card"
    >
        <div className="glowing-card-content p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white">{team.name}</h3>
                    <p className="text-sm text-cyan-400">{team.track}</p>
                </div>
                {team.teamLogoUrl ? (
                    <img src={team.teamLogoUrl} alt={`${team.name} logo`} className="w-12 h-12 rounded-full object-cover bg-slate-700" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold">
                        {team.name.substring(0, 2)}
                    </div>
                )}
            </div>
            <p className="text-slate-400 my-4 text-sm">{team.submission?.description}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-500/30">
                <a
                    href={team.submission?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors"
                >
                    <LinkIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">View Submission</span>
                </a>
                <button className="flex items-center space-x-2 px-3 py-1 bg-slate-700/50 text-amber-300 rounded-full text-xs font-semibold hover:bg-slate-700">
                    <TrophyIcon className="w-4 h-4" />
                    <span>Assign Score</span>
                </button>
            </div>
        </div>
    </motion.div>
);

const SubmissionsPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [submittedTeams, setSubmittedTeams] = useState<Team[]>([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setIsLoading(true);
                const teams = await getTeamsWithSubmissions();
                setSubmittedTeams(teams);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeInUp} className="mb-8">
                <h1 className="text-4xl font-bold flex items-center">
                    <BookOpenIcon className="w-8 h-8 mr-3" />
                    Project Submissions
                </h1>
                <p className="text-slate-400 mt-2">
                    Review and grade the projects submitted by the hackathon participants.
                </p>
            </motion.div>

            {isLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => <SkeletonSubmissionCard key={i} />)}
                </div>
            ) : submittedTeams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {submittedTeams.map(team => (
                        <SubmissionCard key={team.id} team={team} />
                    ))}
                </div>
            ) : (
                <motion.div variants={fadeInUp} className="text-center py-16 bg-[#100D1C]/50 border border-purple-800/60 rounded-xl">
                    <h2 className="text-2xl font-bold text-slate-300">No Submissions Yet</h2>
                    <p className="text-slate-400 mt-2">Check back later once teams start submitting their projects.</p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SubmissionsPage;