import React from 'react';
import { motion } from 'framer-motion';

interface SlideUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const SlideUp: React.FC<SlideUpProps> = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ type: 'spring', stiffness: 100, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

interface GlowButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({ onClick, children, className }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-lg shadow-[0_0_10px_rgba(139,92,246,0.5)] ${className}`}
    >
        {children}
    </motion.button>
);