import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Judge, Team, JudgeEvaluation, JudgingRound, JudgingCriteria } from '../types';
import { getAllTeams } from '../services/firebaseTeamService';
import { submitEvaluation, getLeaderboard } from '../services/firebaseJudgingService';
import { hasJudgeEvaluatedTeam } from '../services/firebaseJuryAuthService';
import { StarIcon, TrophyIcon, UserCircleIcon, CheckCircleIcon, ClipboardCheckIcon } from '../components/IconComponents';
import { useToast } from '../hooks/useToast';
import { fadeInUp, staggerContainer } from '../animations/framerVariants';
import JuryLogin from '../components/JuryLogin';

const criteriaLabels = {
  progress: 'Progress',
  ui: 'UI/UX Design',
  presentation: 'Presentation Skills',
  idea: 'Innovation & Idea',
  implementation: 'Technical Implementation',
};

const JuryPortal: React.FC = () => {
  const [authenticatedJudge, setAuthenticatedJudge] = useState<Judge | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [selectedRound, setSelectedRound] = useState<JudgingRound>('Round 1');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [evaluations, setEvaluations] = useState<JudgeEvaluation[]>([]);
  const [currentCriteria, setCurrentCriteria] = useState<JudgingCriteria>({
    progress: 0,
    ui: 0,
    presentation: 0,
    idea: 0,
    implementation: 0,
  });
  const [comments, setComments] = useState('');
  const [viewMode, setViewMode] = useState<'evaluate' | 'leaderboard'>('evaluate');
  const addToast = useToast();

  // Check for existing jury session
  useEffect(() => {
    const storedAuth = localStorage.getItem('juryAuth');
    if (storedAuth) {
      try {
        const judge = JSON.parse(storedAuth);
        setAuthenticatedJudge(judge);
      } catch (e) {
        localStorage.removeItem('juryAuth');
      }
    }
    setIsCheckingAuth(false);
  }, []);

  // Load teams on mount
  useEffect(() => {
    if (!authenticatedJudge) return;

    const fetchTeams = async () => {
      try {
        setIsLoadingTeams(true);
        const fetchedTeams = await getAllTeams();
        setTeams(fetchedTeams);
      } catch (error) {
        console.error('Error fetching teams:', error);
        addToast('Failed to load teams', 'error');
      } finally {
        setIsLoadingTeams(false);
      }
    };
    fetchTeams();
  }, [authenticatedJudge]);

  const handleLoginSuccess = (judge: Judge) => {
    setAuthenticatedJudge(judge);
  };

  const handleLogout = () => {
    localStorage.removeItem('juryAuth');
    setAuthenticatedJudge(null);
    setSelectedTeam(null);
    setCurrentCriteria({
      progress: 0,
      ui: 0,
      presentation: 0,
      idea: 0,
      implementation: 0,
    });
    setComments('');
  };

  // Show login screen if not authenticated
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!authenticatedJudge) {
    return <JuryLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const judge = authenticatedJudge;

  const handleCriteriaChange = (criterion: keyof JudgingCriteria, value: number) => {
    setCurrentCriteria(prev => ({
      ...prev,
      [criterion]: Math.min(Math.max(0, value), 10), // Clamp between 0-10
    }));
  };

  const calculateTotal = (criteria: JudgingCriteria): number => {
    return Object.values(criteria).reduce((sum, val) => sum + val, 0);
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedTeam) {
      addToast('Please select a team first!', 'error');
      return;
    }

    const total = calculateTotal(currentCriteria);
    if (total === 0) {
      addToast('Please provide marks for at least one criterion!', 'error');
      return;
    }

    try {
      // Check if already evaluated
      const alreadyEvaluated = await hasJudgeEvaluatedTeam(judge.juryId, selectedTeam.id, selectedRound);
      if (alreadyEvaluated) {
        addToast('You have already evaluated this team in this round!', 'error');
        return;
      }

      const newEvaluation: JudgeEvaluation = {
        judgeId: judge.juryId, // Use juryId (J001, J002)
        judgeName: judge.name,
        round: selectedRound,
        teamId: selectedTeam.id,
        criteria: { ...currentCriteria },
        comments,
        totalScore: total,
        evaluatedAt: new Date().toISOString(),
      };

      // Submit to Firebase
      await submitEvaluation(newEvaluation);
      
      setEvaluations(prev => [...prev, newEvaluation]);
      addToast(`Evaluation submitted for Team ${selectedTeam.name}!`, 'success');
      
      // Reset form
      setCurrentCriteria({
        progress: 0,
        ui: 0,
        presentation: 0,
        idea: 0,
        implementation: 0,
      });
      setComments('');
      setSelectedTeam(null);
    } catch (error: any) {
      console.error('Error submitting evaluation:', error);
      addToast(error.message || 'Failed to submit evaluation', 'error');
    }
  };

  const getTeamEvaluations = (teamId: string, round: JudgingRound) => {
    return evaluations.filter(e => e.teamId === teamId && e.round === round);
  };

  const calculateTeamAverage = (teamId: string, round: JudgingRound) => {
    const teamEvals = getTeamEvaluations(teamId, round);
    if (teamEvals.length === 0) return 0;
    const sum = teamEvals.reduce((acc, e) => acc + e.totalScore, 0);
    return (sum / teamEvals.length).toFixed(2);
  };

  const getLeaderboard = () => {
    const teamScores = teams.map(team => {
      const roundEvals = getTeamEvaluations(team.id, selectedRound);
      const avgScore = roundEvals.length > 0
        ? roundEvals.reduce((acc, e) => acc + e.totalScore, 0) / roundEvals.length
        : 0;
      return { team, avgScore };
    });
    
    return teamScores.sort((a, b) => b.avgScore - a.avgScore);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header with Logout */}
        <motion.div variants={fadeInUp} className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Jury Portal</h1>
            <p className="text-slate-400">Welcome, {judge.name}</p>
            <p className="text-sm text-cyan-400">{judge.designation} at {judge.organization}</p>
            <p className="text-xs text-amber-400 mt-1">Jury ID: {judge.juryId}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
          >
            Logout
          </button>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div variants={fadeInUp} className="flex gap-4 mb-6">
          <button
            onClick={() => setViewMode('evaluate')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              viewMode === 'evaluate'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <ClipboardCheckIcon className="w-5 h-5 inline mr-2" />
            Evaluate Teams
          </button>
          <button
            onClick={() => setViewMode('leaderboard')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              viewMode === 'leaderboard'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <TrophyIcon className="w-5 h-5 inline mr-2" />
            Leaderboard
          </button>
        </motion.div>

        {/* Round Selector */}
        <motion.div variants={fadeInUp} className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Select Round</label>
          <div className="flex gap-3">
            {(['Round 1', 'Round 2', 'Final'] as JudgingRound[]).map(round => (
              <button
                key={round}
                onClick={() => setSelectedRound(round)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedRound === round
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {round}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        {viewMode === 'evaluate' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Team Selection */}
            <motion.div variants={fadeInUp} className="bg-[#100D1C]/50 border border-purple-800/60 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Select Team to Evaluate</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {teams.map(team => {
                  const hasEvaluated = getTeamEvaluations(team.id, selectedRound).some(
                    e => e.judgeId === judge.id
                  );
                  return (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeam(team)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedTeam?.id === team.id
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{team.name}</h3>
                          <p className="text-sm text-slate-400">{team.track}</p>
                        </div>
                        {hasEvaluated && (
                          <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Evaluation Form */}
            <motion.div variants={fadeInUp} className="bg-[#100D1C]/50 border border-purple-800/60 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                {selectedTeam ? `Evaluating: ${selectedTeam.name}` : 'Select a team to start'}
              </h2>
              
              {selectedTeam ? (
                <div className="space-y-6">
                  {/* Judging Criteria */}
                  {(Object.keys(criteriaLabels) as Array<keyof JudgingCriteria>).map(criterion => (
                    <div key={criterion}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-slate-300">
                          {criteriaLabels[criterion]}
                        </label>
                        <span className="text-lg font-bold text-cyan-400">
                          {currentCriteria[criterion]}/10
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {[...Array(11)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => handleCriteriaChange(criterion, i)}
                            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                              currentCriteria[criterion] === i
                                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white'
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            }`}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Total Score */}
                  <div className="bg-gradient-to-r from-purple-600/20 to-cyan-500/20 border border-cyan-400/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">Total Score</span>
                      <span className="text-3xl font-bold text-cyan-400">
                        {calculateTotal(currentCriteria)}/50
                      </span>
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Comments (Optional)
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Provide feedback for the team..."
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitEvaluation}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                  >
                    Submit Evaluation
                  </button>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <UserCircleIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Please select a team from the left to begin evaluation</p>
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          // Leaderboard View
          <motion.div variants={fadeInUp} className="bg-[#100D1C]/50 border border-purple-800/60 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Leaderboard - {selectedRound}
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Rank</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Team Name</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Track</th>
                    <th className="text-center py-3 px-4 text-slate-300 font-semibold">Evaluations</th>
                    <th className="text-center py-3 px-4 text-slate-300 font-semibold">Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {getLeaderboard().map(({ team, avgScore }, index) => {
                    const evalCount = getTeamEvaluations(team.id, selectedRound).length;
                    return (
                      <tr
                        key={team.id}
                        className={`border-b border-slate-800 hover:bg-slate-800/30 transition-colors ${
                          index < 3 ? 'bg-gradient-to-r from-purple-900/20 to-cyan-900/20' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {index === 0 && <TrophyIcon className="w-6 h-6 text-yellow-400" />}
                            {index === 1 && <TrophyIcon className="w-6 h-6 text-slate-300" />}
                            {index === 2 && <TrophyIcon className="w-6 h-6 text-orange-400" />}
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white font-semibold">{team.name}</td>
                        <td className="py-4 px-4 text-slate-400">{team.track}</td>
                        <td className="py-4 px-4 text-center text-cyan-400">{evalCount}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-2xl font-bold text-white">
                            {avgScore.toFixed(2)}
                          </span>
                          <span className="text-slate-400">/50</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Security Note */}
        <motion.div variants={fadeInUp} className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-2">🔒 Evaluation Security</h2>
          <p className="text-slate-300 text-sm">
            Each jury member can only submit their own evaluations. You cannot edit or view detailed scores from other jury members to maintain evaluation integrity.
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Your Jury ID: <span className="text-cyan-400 font-mono">{judge.juryId}</span> | Assigned Rounds: {judge.assignedRounds.join(', ')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JuryPortal;
