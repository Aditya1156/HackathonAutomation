import React from 'react';
import { motion } from 'framer-motion';
import { resourcesData } from '../services/mockData';
import { ClipboardCheckIcon, LinkIcon } from './IconComponents';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';

const DashboardResources: React.FC = () => {
    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={fadeInUp}>
                <h1 className="text-3xl font-bold flex items-center">
                    <ClipboardCheckIcon className="w-8 h-8 mr-3 text-cyan-400" />
                    Resource Center
                </h1>
                <p className="text-slate-400 mt-1">
                    Quick links to documentation, tools, and other helpful materials.
                </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resourcesData.map((resource, index) => (
                    <motion.a
                        key={index}
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={fadeInUp}
                        whileHover={{ y: -5, scale: 1.03, borderColor: 'rgba(34, 211, 238, 0.7)' }}
                        className="block bg-[#100D1C]/50 border border-purple-800/60 p-6 rounded-xl backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">{resource.title}</h3>
                            <LinkIcon className="w-5 h-5 text-slate-500" />
                        </div>
                    </motion.a>
                ))}
            </div>
        </motion.div>
    );
};

export default DashboardResources;