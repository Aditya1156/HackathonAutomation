import React from 'react';
// Fix: Import Variants type to correctly type animation variants and resolve type inference issues.
import { motion, type Variants } from 'framer-motion';

// Define all possible modes to ensure the header works correctly on every page.
type AppMode = 'landing' | 'user' | 'admin' | 'student_login' | 'student_dashboard' | 'registration_success';

interface HeaderProps {
  setAppMode: (mode: AppMode) => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ setAppMode, onLogoClick }) => {
  // Variant for the container to orchestrate staggered animations for its children.
  const navContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Base variant for individual items to animate in.
  // Fix: Explicitly type itemVariantBase as Variants to ensure `transition.type` is correctly inferred as a literal type ('spring') instead of a generic string, which resolves the type incompatibility.
  const itemVariantBase: Variants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
  };

  // Combined variants for the logo, including entrance and interactive animations.
  const logoVariants: Variants = {
    ...itemVariantBase,
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { scale: 0.95 },
  };

  // Combined variants for the navigation buttons.
  const buttonVariants: Variants = {
    ...itemVariantBase,
    hover: { scale: 1.05, color: '#22d3ee' },
    tap: { scale: 0.95, filter: 'brightness(0.9)' },
  };

  return (
    <header
      className="bg-[#0D0B14]/70 backdrop-blur-lg sticky top-0 z-50 border-b border-purple-500/20"
    >
      <motion.nav
        variants={navContainerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 py-4 flex justify-between items-center"
      >
        <motion.div
          variants={logoVariants}
          whileHover="hover"
          whileTap="tap"
          className="text-2xl font-bold text-white cursor-pointer cursor-target font-orbitron"
          onClick={onLogoClick}
        >
          Hackathon <span className="text-cyan-400">Fusion</span>
        </motion.div>
        
        <div className="flex items-center space-x-8">
           <motion.button
             variants={buttonVariants}
             whileHover="hover"
             whileTap="tap"
             onClick={() => setAppMode('user')}
             className="text-white font-semibold header-link cursor-target"
           >
             Participant Portal
           </motion.button>
           <motion.button
             variants={buttonVariants}
             whileHover="hover"
             whileTap="tap"
             onClick={() => setAppMode('student_login')}
             className="text-white font-semibold header-link cursor-target"
           >
             Student Dashboard
           </motion.button>
           <motion.button
             variants={buttonVariants}
             whileHover="hover"
             whileTap="tap"
             onClick={() => setAppMode('admin')}
             className="text-white font-semibold header-link cursor-target"
           >
             Admin Portal
           </motion.button>
        </div>
      </motion.nav>
    </header>
  );
};

export default Header;