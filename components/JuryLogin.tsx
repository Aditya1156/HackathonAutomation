import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authenticateJudge } from '../services/firebaseJuryAuthService';
import type { Judge } from '../types';
import { CheckCircleIcon, XCircleIcon } from './IconComponents';

interface JuryLoginProps {
  onLoginSuccess: (judge: Judge) => void;
}

const JuryLogin: React.FC<JuryLoginProps> = ({ onLoginSuccess }) => {
  const [juryId, setJuryId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [juryIdError, setJuryIdError] = useState<string | null>(null);
  const [isIdTouched, setIsIdTouched] = useState(false);

  const validateJuryId = (id: string) => {
    if (!id && isIdTouched) {
      setJuryIdError('Jury ID is required.');
      return false;
    }
    const regex = /^J\d{3}$/; // Format: J001, J002, etc.
    if (id && !regex.test(id)) {
      setJuryIdError('Format must be J followed by 3 digits (e.g., J001).');
      return false;
    }
    setJuryIdError(null);
    return true;
  };

  const handleJuryIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value.toUpperCase();
    setJuryId(newId);
    if (isIdTouched) {
      validateJuryId(newId);
    }
  };

  const handleJuryIdBlur = () => {
    setIsIdTouched(true);
    validateJuryId(juryId);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIdTouched(true);
    const isIdValid = validateJuryId(juryId);

    if (!isIdValid || !password) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const judge = await authenticateJudge(juryId, password);

      if (!judge) {
        setError('Invalid Jury ID or password. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Store judge session
      localStorage.setItem('juryAuth', JSON.stringify(judge));
      onLoginSuccess(judge);
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
      setLoading(false);
    }
  };

  const isIdValid = isIdTouched && !juryIdError && juryId;

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gradient-to-br from-[#0D0B14] via-[#1a0e2e] to-[#0D0B14] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#100D1C]/80 backdrop-blur-lg border border-purple-500/30 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="inline-block p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full mb-4"
            >
              <svg className="w-12 h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Jury Portal
            </h2>
            <p className="text-slate-400 mt-2">Sign in to evaluate teams</p>
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-amber-400 text-xs font-semibold mb-2">🎯 Jury Members</p>
            <div className="text-slate-300 text-xs space-y-1">
              <p>• MANU SIR (J001)</p>
              <p>• CHETAN SIR (J002)</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <div className="flex items-start space-x-2">
                <XCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="juryId" className="block text-sm font-medium text-slate-300 mb-2">
                Jury ID
              </label>
              <div className="relative">
                <input
                  id="juryId"
                  type="text"
                  value={juryId}
                  onChange={handleJuryIdChange}
                  onBlur={handleJuryIdBlur}
                  placeholder="e.g., J001"
                  required
                  className={`w-full px-4 py-3 pr-10 bg-[#1a1427] border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-slate-500 transition-all ${
                    juryIdError
                      ? 'border-red-500 focus:ring-red-500'
                      : isIdValid
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-purple-500/30 focus:ring-amber-500'
                  }`}
                />
                {isIdValid && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-green-400"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                  </motion.div>
                )}
              </div>
              {juryIdError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {juryIdError}
                </motion.p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1427] border-2 border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                loading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/50'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Sign In as Jury'
              )}
            </motion.button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <p className="text-cyan-400 text-xs font-semibold mb-1">🔒 Secure Evaluation</p>
            <p className="text-slate-400 text-xs">
              Each jury member can only edit their own evaluations. Other jury marks are read-only.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JuryLogin;
