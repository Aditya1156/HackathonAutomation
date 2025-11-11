import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Team } from '../types';
import { getTeamById } from '../services/firebaseTeamService';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';
import { GlowButton } from '../components/AnimatedComponents';
import { XCircleIcon, CheckCircleIcon } from '../components/IconComponents';

interface StudentLoginPageProps {
  onLoginSuccess: (team: Team) => void;
}

const StudentLoginPage: React.FC<StudentLoginPageProps> = ({ onLoginSuccess }) => {
    const [teamId, setTeamId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [teamIdError, setTeamIdError] = useState<string | null>(null);
    const [isIdTouched, setIsIdTouched] = useState(false);

    const validateTeamId = (id: string) => {
        if (!id && isIdTouched) {
            setTeamIdError("Team ID is required.");
            return false;
        }
        const regex = /^T\d+$/;
        if (id && !regex.test(id)) {
            setTeamIdError("Format must be 'T' followed by numbers (e.g., T1672531200000).");
            return false;
        }
        setTeamIdError(null);
        return true;
    };

    const handleTeamIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newId = e.target.value.toUpperCase();
        setTeamId(newId);
        if (isIdTouched) {
            validateTeamId(newId);
        }
    };
    
    const handleTeamIdBlur = () => {
        setIsIdTouched(true);
        validateTeamId(teamId);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsIdTouched(true);
        const isIdValid = validateTeamId(teamId);

        if (!isIdValid || !password) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Fetch team from Firebase
            const foundTeam = await getTeamById(teamId);
            
            if (!foundTeam) {
                setError('Team ID not found. Please check your credentials.');
                setIsLoading(false);
                return;
            }
            
            if (foundTeam.password !== password) {
                setError('Invalid password. Please check your credentials.');
                setIsLoading(false);
                return;
            }
            
            onLoginSuccess(foundTeam);
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.message || 'Failed to login. Please try again.');
            setIsLoading(false);
        }
    };

    const isIdValid = isIdTouched && !teamIdError && teamId;

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md"
            >
                <motion.div
                    variants={fadeInUp}
                    className="bg-[#100D1C]/60 border border-purple-800/60 p-8 rounded-2xl backdrop-blur-lg shadow-2xl shadow-purple-900/20"
                >
                    <h1 className="text-3xl font-bold text-center text-white mb-2 font-orbitron">Team Login</h1>
                    <p className="text-center text-slate-400 mb-8">Access your hackathon dashboard.</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="teamId" className="block mb-2 text-sm font-medium text-slate-300">Team ID</label>
                            <div className="relative">
                                <input
                                    id="teamId"
                                    type="text"
                                    value={teamId}
                                    onChange={handleTeamIdChange}
                                    onBlur={handleTeamIdBlur}
                                    placeholder="e.g., T1672531200000"
                                    required
                                    className={`w-full p-3 pr-10 bg-slate-800 border-2 rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                                        teamIdError ? 'border-rose-500 focus:ring-rose-500' 
                                        : isIdValid ? 'border-green-500 focus:ring-green-500' 
                                        : 'border-purple-500/30 focus:ring-cyan-500'
                                    }`}
                                />
                                {isIdValid && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1/2 right-3 -translate-y-1/2 text-green-400">
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </div>
                            {teamIdError && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-rose-400 text-sm mt-1"
                                >
                                    {teamIdError}
                                </motion.p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-300">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full p-3 bg-slate-800 border-2 border-purple-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start space-x-2 text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/30"
                            >
                                <XCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="text-sm">{error}</p>
                            </motion.div>
                        )}

                        <div>
                            <GlowButton onClick={() => {}} className="w-full py-3 text-base">
                                {isLoading ? (
                                    <div className="flex justify-center items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authenticating...
                                    </div>
                                ) : (
                                    'Login to Dashboard'
                                )}
                            </GlowButton>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default StudentLoginPage;