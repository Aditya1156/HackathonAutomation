import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../hooks/useToast';
import { CogIcon, CheckCircleIcon } from '../components/IconComponents';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';
import { GlowButton } from '../components/AnimatedComponents';

const colorOptions = [
  { name: 'Cyan', value: '#00BFFF', class: 'bg-[#00BFFF]' },
  { name: 'Purple', value: '#7F00FF', class: 'bg-[#7F00FF]' },
  { name: 'Emerald', value: '#10B981', class: 'bg-[#10B981]' },
  { name: 'Amber', value: '#F59E0B', class: 'bg-[#F59E0B]' },
  { name: 'Rose', value: '#F43F5E', class: 'bg-[#F43F5E]' },
];

const SettingsPage: React.FC = () => {
  const [themeColor, setThemeColor] = useState<string>('#00BFFF');
  const [isSaving, setIsSaving] = useState(false);
  const addToast = useToast();

  useEffect(() => {
    const savedColor = localStorage.getItem('hackathonThemeColor');
    if (savedColor) {
      setThemeColor(savedColor);
    }
  }, []);

  const handleSaveSettings = () => {
    setIsSaving(true);
    localStorage.setItem('hackathonThemeColor', themeColor);

    setTimeout(() => {
      setIsSaving(false);
      addToast('Settings saved successfully!', 'success');
    }, 1000);
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.h1 variants={fadeInUp} className="text-4xl font-bold mb-8 flex items-center">
        <CogIcon className="w-8 h-8 mr-3" />
        Settings
      </motion.h1>

      <motion.div
        variants={fadeInUp}
        className="bg-[#100D1C]/50 border border-purple-800/60 p-8 rounded-xl backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-purple-500/30 pb-4">
          Appearance
        </h2>
        
        <div className="space-y-4">
          <label className="block text-lg font-medium text-slate-300">
            Primary Theme Color
          </label>
          <p className="text-sm text-slate-400">
            This color will be used for primary buttons and highlights across the event pages. (Mock Setting)
          </p>

          <div className="flex items-center gap-4 pt-2 flex-wrap">
            {colorOptions.map((color) => (
              <motion.button
                key={color.value}
                onClick={() => setThemeColor(color.value)}
                className={`w-12 h-12 rounded-full transition-all duration-200 ${color.class}`}
                whileHover={{ scale: 1.1 }}
                animate={{ scale: themeColor === color.value ? 1.15 : 1 }}
                style={{
                  outline: themeColor === color.value ? '2px solid white' : 'none',
                  outlineOffset: '2px'
                }}
              >
                {themeColor === color.value && (
                  <CheckCircleIcon className="w-6 h-6 text-white mx-auto" />
                )}
              </motion.button>
            ))}
            
            <div className="flex items-center space-x-3 ml-4">
               <div
                  className="w-10 h-10 rounded-lg border-2 border-slate-600"
                  style={{ backgroundColor: themeColor }}
                />
                <span className="font-mono text-slate-300">{themeColor}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-purple-500/30 flex justify-end">
            <GlowButton onClick={handleSaveSettings} className="px-6 py-2">
                 {isSaving ? 'Saving...' : 'Save Settings'}
            </GlowButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;