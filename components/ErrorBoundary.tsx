import React from 'react';
import { motion } from 'framer-motion';
import { XCircleIcon } from './IconComponents';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full bg-[#100D1C]/80 border border-rose-500/50 rounded-xl p-8 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-3 mb-4">
              <XCircleIcon className="w-10 h-10 text-rose-400 flex-shrink-0" />
              <h1 className="text-2xl font-bold text-white font-orbitron">
                Oops! Something went wrong
              </h1>
            </div>
            
            <p className="text-slate-300 mb-6">
              We encountered an unexpected error. Don't worry, your data is safe. 
              Please try refreshing the page or contact support if the problem persists.
            </p>

            {this.state.error && (
              <details className="mb-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <summary className="cursor-pointer text-cyan-400 font-semibold mb-2">
                  Error Details (for developers)
                </summary>
                <div className="text-sm text-slate-400 font-mono whitespace-pre-wrap break-words">
                  <p className="text-rose-300 mb-2">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <p className="text-slate-500">{this.state.errorInfo.componentStack}</p>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
