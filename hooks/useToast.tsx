import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, MegaphoneIcon, TrophyIcon } from '../components/IconComponents';

type ToastType = 'success' | 'error' | 'info' | 'celebrate';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

type AddToastFunction = (message: string, type: ToastType) => void;

const ToastContext = createContext<AddToastFunction | undefined>(undefined);

export const useToast = (): AddToastFunction => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const Toast: React.FC<{ message: ToastMessage; onDismiss: (id: number) => void }> = React.memo(({ message, onDismiss }) => {
  const TOAST_DURATION = 5000;
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(message.id);
    }, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [message.id, onDismiss]);

  const isCelebrate = message.type === 'celebrate';

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
    error: <XCircleIcon className="w-6 h-6 text-rose-400" />,
    info: <MegaphoneIcon className="w-6 h-6 text-cyan-400" />,
    celebrate: (
        <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, 0]}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <TrophyIcon className="w-8 h-8 text-yellow-400" />
        </motion.div>
    ),
  };

  const borderColors: Record<ToastType, string> = {
    success: 'border-green-500/50',
    error: 'border-rose-500/50',
    info: 'border-cyan-500/50',
    celebrate: 'border-yellow-500/50',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative flex items-center space-x-4 rounded-lg shadow-xl bg-[#1a1a2e]/80 backdrop-blur-md border overflow-hidden ${borderColors[message.type]} ${isCelebrate ? 'p-6' : 'p-4'}`}
    >
      <div>{icons[message.type]}</div>
      <p className={`font-medium text-white ${isCelebrate ? 'text-lg' : ''}`}>{message.message}</p>
       <div 
        className="absolute bottom-0 left-0 h-1 bg-white/50" 
        style={{ animation: `toast-timer-shrink ${TOAST_DURATION}ms linear forwards` }}
      />
    </motion.div>
  );
});export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[2000] space-y-3">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} message={toast} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};