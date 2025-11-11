import React from 'react';
import { motion } from 'framer-motion';
import type { Team, JudgeEvaluation, JudgingRound, JudgingCriteria } from '../types';
import { StarIcon, UserCircleIcon, TrophyIcon } from '../components/IconComponents';
import { fadeInUp, staggerContainer } from '../animations/framerVariants';

interface TeamEvaluationDetailsProps {
  team: Team;
  evaluations: JudgeEvaluation[];
}

const criteriaLabels = {
  progress: 'Progress',
  ui: 'UI/UX Design',
  presentation: 'Presentation',
  idea: 'Innovation',
  implementation: 'Implementation',
};

const TeamEvaluationDetails: React.FC<TeamEvaluationDetailsProps> = ({ team, evaluations }) => {
  const rounds: JudgingRound[] = ['Round 1', 'Round 2', 'Final'];

  const getEvaluationsByRound = (round: JudgingRound) => {
    return evaluations.filter(e => e.round === round);
  };

  const calculateRoundAverage = (round: JudgingRound): string => {
    const roundEvals = getEvaluationsByRound(round);
    if (roundEvals.length === 0) return '0';
    const sum = roundEvals.reduce((acc, e) => e.totalScore + acc, 0);
    return (sum / roundEvals.length).toFixed(2);
  };

  const calculateCriteriaAverage = (round: JudgingRound, criterion: keyof JudgingCriteria): string => {
    const roundEvals = getEvaluationsByRound(round);
    if (roundEvals.length === 0) return '0';
    const sum = roundEvals.reduce((acc, e) => e.criteria[criterion] + acc, 0);
    return (sum / roundEvals.length).toFixed(1);
  };

  const calculateOverallAverage = (): string => {
    if (evaluations.length === 0) return '0';
    const sum = evaluations.reduce((acc, e) => e.totalScore + acc, 0);
    return (sum / evaluations.length).toFixed(2);
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-cyan-400';
    if (percentage >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Team Header */}
        <motion.div variants={fadeInUp} className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{team.name}</h1>
              <p className="text-slate-300">{team.track}</p>
              <p className="text-sm text-slate-400">{team.collegeName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-1">Overall Average Score</p>
              <p className={`text-5xl font-bold ${getScoreColor(parseFloat(calculateOverallAverage()), 50)}`}>
                {calculateOverallAverage()}
              </p>
              <p className="text-slate-400">/50</p>
            </div>
          </div>
        </motion.div>

        {/* Round-wise Evaluations */}
        {rounds.map(round => {
          const roundEvals = getEvaluationsByRound(round);
          const roundAvg = calculateRoundAverage(round);

          return (
            <motion.div
              key={round}
              variants={fadeInUp}
              className="bg-[#100D1C]/50 border border-purple-800/60 rounded-xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{round}</h2>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Round Average</p>
                  <p className={`text-3xl font-bold ${getScoreColor(parseFloat(roundAvg), 50)}`}>
                    {roundAvg}/50
                  </p>
                </div>
              </div>

              {roundEvals.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>No evaluations yet for this round</p>
                </div>
              ) : (
                <>
                  {/* Criteria Summary Table */}
                  <div className="mb-6 overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-slate-300 font-semibold">Criterion</th>
                          {roundEvals.map((evaluation, idx) => (
                            <th key={idx} className="text-center py-3 px-4 text-slate-300 font-semibold">
                              {evaluation.judgeName.split(' ')[0]}
                            </th>
                          ))}
                          <th className="text-center py-3 px-4 text-cyan-400 font-semibold">Avg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Object.keys(criteriaLabels) as Array<keyof JudgingCriteria>).map(criterion => (
                          <tr key={criterion} className="border-b border-slate-800 hover:bg-slate-800/30">
                            <td className="py-3 px-4 text-white font-medium">{criteriaLabels[criterion]}</td>
                            {roundEvals.map((evaluation, idx) => (
                              <td key={idx} className="text-center py-3 px-4">
                                <span className={`font-bold ${getScoreColor(evaluation.criteria[criterion], 10)}`}>
                                  {evaluation.criteria[criterion]}
                                </span>
                                <span className="text-slate-500">/10</span>
                              </td>
                            ))}
                            <td className="text-center py-3 px-4">
                              <span className="text-lg font-bold text-cyan-400">
                                {calculateCriteriaAverage(round, criterion)}
                              </span>
                              <span className="text-slate-500">/10</span>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-slate-800/50">
                          <td className="py-3 px-4 text-white font-bold">Total Score</td>
                          {roundEvals.map((evaluation, idx) => (
                            <td key={idx} className="text-center py-3 px-4">
                              <span className={`text-xl font-bold ${getScoreColor(evaluation.totalScore, 50)}`}>
                                {evaluation.totalScore}
                              </span>
                              <span className="text-slate-500">/50</span>
                            </td>
                          ))}
                          <td className="text-center py-3 px-4">
                            <span className={`text-xl font-bold ${getScoreColor(parseFloat(roundAvg), 50)}`}>
                              {roundAvg}
                            </span>
                            <span className="text-slate-500">/50</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Individual Judge Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roundEvals.map((evaluation, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <UserCircleIcon className="w-10 h-10 text-slate-500" />
                          <div>
                            <h3 className="font-semibold text-white">{evaluation.judgeName}</h3>
                            <p className="text-xs text-slate-400">
                              {new Date(evaluation.evaluatedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="ml-auto text-right">
                            <p className={`text-2xl font-bold ${getScoreColor(evaluation.totalScore, 50)}`}>
                              {evaluation.totalScore}
                            </p>
                            <p className="text-xs text-slate-400">/50</p>
                          </div>
                        </div>

                        {/* Criteria Breakdown */}
                        <div className="grid grid-cols-5 gap-2 mb-3">
                          {(Object.keys(evaluation.criteria) as Array<keyof JudgingCriteria>).map(criterion => (
                            <div key={criterion} className="text-center">
                              <p className="text-xs text-slate-400 mb-1">
                                {criteriaLabels[criterion].split(' ')[0]}
                              </p>
                              <p className={`font-bold ${getScoreColor(evaluation.criteria[criterion], 10)}`}>
                                {evaluation.criteria[criterion]}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Comments */}
                        {evaluation.comments && (
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-xs text-slate-400 mb-1">Feedback:</p>
                            <p className="text-sm text-slate-300">{evaluation.comments}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          );
        })}

        {/* Criteria Performance Chart */}
        <motion.div variants={fadeInUp} className="bg-[#100D1C]/50 border border-purple-800/60 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Overall Performance by Criteria</h2>
          <div className="space-y-4">
            {(Object.keys(criteriaLabels) as Array<keyof JudgingCriteria>).map(criterion => {
              const allScores = evaluations.map(e => e.criteria[criterion]);
              const avg = allScores.length > 0
                ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
                : '0.0';
              const percentage = (parseFloat(avg) / 10) * 100;

              return (
                <div key={criterion}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-300">
                      {criteriaLabels[criterion]}
                    </span>
                    <span className={`text-lg font-bold ${getScoreColor(parseFloat(avg), 10)}`}>
                      {avg}/10
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <motion.div
                      className={`h-3 rounded-full ${
                        percentage >= 80
                          ? 'bg-green-500'
                          : percentage >= 60
                          ? 'bg-cyan-500'
                          : percentage >= 40
                          ? 'bg-yellow-500'
                          : 'bg-orange-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TeamEvaluationDetails;
