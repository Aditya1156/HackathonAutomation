import React from 'react';
import { motion } from 'framer-motion';
import { scheduleData } from '../services/mockData';
import { CheckCircleIcon } from './IconComponents';

const DashboardProgress: React.FC = () => {
  // In a real app, this would be based on the actual current time.
  const currentStepIndex = 4;

  return (
    <div className="bg-[#100D1C]/50 border border-purple-800/60 p-6 rounded-xl backdrop-blur-sm h-full">
      <h2 className="text-xl font-bold mb-6">Hackathon Progress</h2>
      <div className="relative">
        {/* The connecting line */}
        <div className="absolute left-5 top-2 h-[calc(100%-1rem)] w-1 bg-slate-700 rounded-full" />

        <div className="space-y-8">
          {scheduleData.map((item, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <motion.div
                key={item.title}
                className="flex items-start space-x-4 relative"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  isCompleted ? 'bg-green-500 border-green-700' : 
                  isCurrent ? 'bg-cyan-500 border-cyan-700 animate-pulse' : 
                  'bg-slate-600 border-slate-800'
                }`}>
                  {isCompleted && <CheckCircleIcon className="w-6 h-6 text-white" />}
                </div>
                <div className={`pt-1 ${isCurrent ? 'font-bold' : ''}`}>
                  <p className={`text-sm ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}`}>{item.time}</p>
                  <p className={`-mt-1 ${isCurrent ? 'text-white text-lg' : 'text-slate-300'}`}>{item.title}</p>
                  {!isCurrent && <p className="text-xs text-slate-500">{item.description}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardProgress;