import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Team } from '../types';
import { BookOpenIcon, LinkIcon, CopyIcon, CheckCircleIcon, TrophyIcon, XIcon } from './IconComponents';
import { useToast } from '../hooks/useToast';
import { staggerContainer, fadeInUp, modalBackdropVariants, modalContentVariants } from '../animations/framerVariants';

const SubmissionSuccessModal: React.FC<{ team: Team, submission: { link: string, desc: string }, onClose: () => void }> = ({ team, submission, onClose }) => (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4"
      variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden"
    >
      <motion.div variants={modalContentVariants} className="glowing-card w-full max-w-2xl">
        <div className="glowing-card-content p-8 text-center relative">
          <motion.div className="w-20 h-20 mx-auto mb-4" initial={{ scale: 0 }} animate={{ scale: 1, transition: { type: 'spring', delay: 0.2 } }}>
            <svg className="w-full h-full" viewBox="0 0 52 52">
              <circle className="text-green-500/20" cx="26" cy="26" r="25" fill="currentColor"/>
              <motion.path
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
                className="text-green-400" fill="none" stroke="currentColor" strokeWidth="4" d="M14 27l6 6 18-18"
              />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold font-orbitron text-white">Project Submitted!</h2>
          <p className="text-slate-300 mt-2">Congratulations, Team <span className="font-bold text-cyan-400">{team.name}</span>!</p>
          <button onClick={onClose} className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg">
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

const DashboardProject: React.FC<{ team: Team }> = ({ team }) => {
    const [submissionLink, setSubmissionLink] = useState(team.submission?.link || '');
    const [submissionDesc, setSubmissionDesc] = useState(team.submission?.description || '');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const addToast = useToast();

    // Add defensive check
    if (!team || !team.githubRepo) {
        return <div className="text-white">Loading project data...</div>;
    }

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(team.githubRepo);
        addToast('GitHub URL copied to clipboard!', 'info');
    };

    const handleSubmission = (e: React.FormEvent) => {
        e.preventDefault();
        if (!submissionLink || !submissionDesc) {
            addToast('Please fill out both submission fields.', 'info');
            return;
        }
        setIsSuccessModalOpen(true);
    };

    return (
        <>
        <AnimatePresence>
            {isSuccessModalOpen && (
                <SubmissionSuccessModal 
                    team={team} 
                    submission={{ link: submissionLink, desc: submissionDesc }} 
                    onClose={() => setIsSuccessModalOpen(false)}
                />
            )}
        </AnimatePresence>
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center"><BookOpenIcon className="w-8 h-8 mr-3 text-cyan-400"/> Project Hub</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#100D1C]/50 border border-purple-800/60 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4">Synopsis</h2>
                    <p className="text-slate-400">{team.projectSynopsis}</p>
                </div>
                <div className="bg-[#100D1C]/50 border border-purple-800/60 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4">GitHub Repository</h2>
                    <p className="truncate text-cyan-400 mb-4 font-mono">{team.githubRepo.replace('https://github.com/', '')}</p>
                    <div className="flex space-x-2">
                        <a href={team.githubRepo} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/80 rounded-lg hover:bg-slate-700 transition-colors">
                           <LinkIcon className="w-5 h-5" /> Open
                        </a>
                        <button onClick={handleCopyUrl} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/80 rounded-lg hover:bg-slate-700 transition-colors">
                           <CopyIcon className="w-5 h-5" /> Copy
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-[#100D1C]/50 border border-purple-800/60 p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <TrophyIcon className="w-6 h-6 mr-3 text-cyan-400"/> Final Submission
                </h2>
                <form onSubmit={handleSubmission} className="space-y-4">
                    <div>
                        <label htmlFor="sub-link" className="block text-sm font-medium mb-1 text-slate-300">Repository/Demo Link</label>
                        <input type="url" id="sub-link" value={submissionLink} onChange={e => setSubmissionLink(e.target.value)} required className="w-full p-2 bg-slate-800/70 border border-purple-500/30 rounded-md focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <div>
                        <label htmlFor="sub-desc" className="block text-sm font-medium mb-1 text-slate-300">Short Description</label>
                        <textarea id="sub-desc" rows={4} value={submissionDesc} onChange={e => setSubmissionDesc(e.target.value)} required className="w-full p-2 bg-slate-800/70 border border-purple-500/30 rounded-md focus:ring-2 focus:ring-cyan-500"></textarea>
                    </div>
                    <motion.button 
                        type="submit" 
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg shadow-lg"
                        whileHover={{ scale: 1.02, transition: { type: 'spring' } }}
                    >
                        Submit Project
                    </motion.button>
                </form>
            </div>
        </div>
        </>
    );
};

export default DashboardProject;