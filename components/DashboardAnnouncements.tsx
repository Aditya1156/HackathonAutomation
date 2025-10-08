import React from 'react';
import { motion } from 'framer-motion';
import { announcementsData } from '../services/mockData';
import { MegaphoneIcon, StarIcon } from './IconComponents';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';

const priorityStyles = {
    high: { icon: <StarIcon className="w-5 h-5 text-rose-400"/>, ring: 'ring-rose-500/50' },
    medium: { icon: <MegaphoneIcon className="w-5 h-5 text-amber-400"/>, ring: 'ring-amber-500/50' },
    low: { icon: null, ring: '' },
}

const DashboardAnnouncements: React.FC = () => {
    return (
        <motion.div 
            variants={fadeInUp} 
            className="bg-[#100D1C]/50 border border-purple-800/60 p-6 rounded-xl backdrop-blur-sm h-full"
        >
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <MegaphoneIcon className="w-6 h-6 mr-3 text-cyan-400"/>
                Announcements
            </h2>
            <div className="space-y-4">
                {announcementsData.map(ann => {
                    const styles = priorityStyles[ann.priority];
                    return (
                        <div key={ann.id} className={`p-3 bg-slate-800/50 rounded-lg relative ${styles.ring} ${ann.priority === 'high' ? 'ring-2' : ''}`}>
                             <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                                <span>{ann.time}</span>
                                {styles.icon}
                            </div>
                            <p className="text-sm text-slate-300">{ann.content}</p>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default DashboardAnnouncements;