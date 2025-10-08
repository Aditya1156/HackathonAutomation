import React, { useState, useRef } from 'react';
// Fix: Import Variants type from framer-motion to correctly type the animation variants.
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import type { Prize, ScheduleItem, FaqItem } from '../types';
import { scheduleData, faqData, sponsorsData } from '../services/mockData';
import {
    TrophyIcon,
    MedalIcon,
    StarIcon,
    ChevronDownIcon,
    MapPinIcon,
    ScaleIcon,
    BookOpenIcon,
    UsersIcon,
    DollarSignIcon,
    HomeIcon,
} from '../components/IconComponents';
import GlowingCard from '../components/GlowingCard';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';
import { SlideUp } from '../components/AnimatedComponents';

// Data from LandingPage.tsx, can be moved to a shared file later
const prizes: Prize[] = [
    { rank: '1st Place', reward: '$5,000 + Tech Swag', icon: <TrophyIcon className="w-12 h-12 text-yellow-400" /> },
    { rank: '2nd Place', reward: '$2,500 + Gadgets', icon: <MedalIcon className="w-12 h-12 text-slate-300" /> },
    { rank: '3rd Place', reward: '$1,000 + Vouchers', icon: <StarIcon className="w-12 h-12 text-amber-500" /> },
];

// Reusable components from LandingPage.tsx
const FaqAccordionItem: React.FC<{ item: FaqItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-purple-500/20">
            <button
                className="w-full flex justify-between items-center text-left py-4 px-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-slate-200">{item.question}</span>
                <ChevronDownIcon className={`w-6 h-6 text-cyan-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="p-4 pt-0 text-slate-400">{item.answer}</p>
            </div>
        </div>
    );
}

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <GlowingCard className="h-full">
         <div className="glowing-card-content p-6 h-full !bg-[#100D1C]/80">
            <div className="flex items-center mb-3">
                <div className="bg-cyan-600/10 p-2 rounded-md mr-4 border border-cyan-500/20">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <div className="text-slate-400 space-y-2">{children}</div>
        </div>
    </GlowingCard>
);

const AnimatedTimelineItem: React.FC<{ item: ScheduleItem; index: number }> = ({ item, index }) => {
    const isEven = index % 2 === 0;

    // Fix: Add Variants type to prevent TypeScript from inferring 'type' as a generic string.
    const contentVariants: Variants = {
      hidden: { opacity: 0, x: isEven ? -50 : 50 },
      visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.1 } },
    };
    
    // Fix: Add Variants type to prevent TypeScript from inferring 'type' as a generic string.
    const dotVariants: Variants = {
        hidden: { scale: 0 },
        visible: { scale: 1, transition: { type: "spring", stiffness: 400, damping: 15, duration: 0.8 } }
    };

    const content = (
         <motion.div 
            variants={contentVariants}
            className="timeline-content bg-[#100D1C]/50 border border-purple-800/60 p-6 rounded-xl backdrop-blur-sm"
        >
            <p className="text-cyan-400 font-semibold">{item.time}</p>
            <h3 className="text-xl font-bold mt-1 text-white">{item.title}</h3>
            <p className="text-slate-400 mt-1">{item.description}</p>
        </motion.div>
    );

    return (
        <motion.div 
            className="relative flex items-start my-8 timeline-item-group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
        >
            <div className="w-1/2 pr-8 text-right">
                {isEven && content}
            </div>
            
            <motion.div 
                variants={dotVariants}
                whileHover={{ 
                    scale: 1.5, 
                    boxShadow: '0 0 20px #00BFFF, 0 0 30px #00BFFF' 
                }}
                className="timeline-dot absolute left-1/2 w-4 h-4 bg-cyan-400 rounded-full top-2 -translate-x-1/2 border-4 border-[#0D0B14] transition-shadow duration-300"
            />
            
            <div className="w-1/2 pl-8 text-left">
                {!isEven && content}
            </div>
        </motion.div>
    );
};

const EventDetailsPage: React.FC = () => {
    const timelineRef = useRef(null);
    const { scrollYProgress: timelineScrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start center", "end center"]
    });
    const pathHeight = useTransform(timelineScrollYProgress, [0, 1], [0, 1]);

    return (
        <div className="container mx-auto px-6 py-12 space-y-24 md:space-y-32">
            <motion.div
                className="text-center"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold font-orbitron animated-underline-title">
                    Event Details
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-slate-400 mt-4 max-w-2xl mx-auto">
                    All the essential information you need for Hackathon Fusion. Get acquainted with the rules, schedule, and what to expect.
                </motion.p>
            </motion.div>
            
            {/* Details Grid Section */}
            <section id="details">
                <h2 className="text-3xl font-bold text-center mb-16 animated-underline-title font-orbitron">Hackathon Guide</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SlideUp delay={0}><InfoCard icon={<MapPinIcon className="w-6 h-6 text-cyan-400" />} title="Venue">
                        <p><strong>Location:</strong> Grand Tech Auditorium, 123 Innovation Drive, Silicon Valley, CA 94043</p>
                        <p><strong>Getting there:</strong> Ample parking available. Accessible via public transport (Line 5 Tech Bus).</p>
                    </InfoCard></SlideUp>
                    <SlideUp delay={0.1}><InfoCard icon={<BookOpenIcon className="w-6 h-6 text-cyan-400" />} title="Rules & Regs">
                        <ul className="list-disc list-inside">
                            <li>Team size: 2-4 members.</li>
                            <li>All code must be written during the hackathon.</li>
                            <li>Use of open-source libraries is permitted.</li>
                            <li>Follow the Code of Conduct at all times.</li>
                        </ul>
                    </InfoCard></SlideUp>
                    <SlideUp delay={0.2}><InfoCard icon={<ScaleIcon className="w-6 h-6 text-cyan-400" />} title="Judging Criteria">
                        <ul className="list-disc list-inside">
                            <li><strong>Innovation:</strong> Is the idea original and creative?</li>
                            <li><strong>Impact:</strong> How well does it solve a real-world problem?</li>
                            <li><strong>Technicality:</strong> Quality of code and implementation.</li>
                            <li><strong>Presentation:</strong> How well is the project demoed?</li>
                        </ul>
                    </InfoCard></SlideUp>
                    <SlideUp delay={0.3}><InfoCard icon={<UsersIcon className="w-6 h-6 text-cyan-400" />} title="Organizers">
                        <p>For any queries, contact the organizing committee:</p>
                        <p><strong>Email:</strong> <a href="mailto:contact@hackfusion.com" className="text-cyan-400 hover:underline">contact@hackfusion.com</a></p>
                    </InfoCard></SlideUp>
                    <SlideUp delay={0.4}><InfoCard icon={<DollarSignIcon className="w-6 h-6 text-cyan-400" />} title="Processing Fee">
                        <p>A non-refundable fee of <strong>$10 per participant</strong> is required to confirm registration. This covers meals, snacks, and swag.</p>
                    </InfoCard></SlideUp>
                    <SlideUp delay={0.5}><InfoCard icon={<HomeIcon className="w-6 h-6 text-cyan-400" />} title="Accommodation">
                        <p>For out-of-town participants, limited accommodation can be arranged in university dorms on a first-come, first-served basis. Please indicate your requirement during registration.</p>
                    </InfoCard></SlideUp>
                </div>
            </section>
            
            {/* Schedule Section */}
            <section id="schedule">
                <h2 className="text-3xl font-bold text-center mb-16 animated-underline-title font-orbitron">Event Timeline</h2>
                <div ref={timelineRef} className="relative max-w-3xl mx-auto">
                    <div className="absolute left-1/2 w-0.5 h-full bg-purple-700/30 -translate-x-1/2" aria-hidden="true"></div>
                    <motion.div 
                        className="absolute left-1/2 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500 -translate-x-1/2"
                        style={{ scaleY: pathHeight, transformOrigin: 'top' }}
                    />
                    {scheduleData.map((item, index) => (
                        <AnimatedTimelineItem key={index} item={item} index={index} />
                    ))}
                </div>
            </section>
            
            {/* Prizes Section */}
            <section>
                <h2 className="text-3xl font-bold text-center mb-12 animated-underline-title font-orbitron">Prizes & Recognition</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {prizes.map((prize, i) => {
                        const colors = {
                            '1st Place': 'shadow-yellow-400/20 border-yellow-400/50',
                            '2nd Place': 'shadow-slate-300/20 border-slate-300/50',
                            '3rd Place': 'shadow-amber-500/20 border-amber-500/50'
                        };
                        return (
                            <SlideUp key={prize.rank} delay={i * 0.1}>
                                <div className={`text-center h-full p-8 bg-[#100D1C]/50 border rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${colors[prize.rank as keyof typeof colors]}`}>
                                    {prize.icon}
                                    <h3 className="text-2xl font-bold mt-4 text-white">{prize.rank}</h3>
                                    <p className="text-cyan-400 text-xl font-semibold mt-2">{prize.reward}</p>
                                </div>
                            </SlideUp>
                        )
                    })}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 animated-underline-title font-orbitron">Frequently Asked Questions</h2>
                <SlideUp>
                    <div className="bg-[#100D1C]/50 border border-purple-800/60 rounded-lg p-4 backdrop-blur-sm">
                        {faqData.map((item, index) => <FaqAccordionItem key={index} item={item} />)}
                    </div>
                </SlideUp>
            </section>
            
            {/* Sponsors Section */}
            <section>
                <h2 className="text-3xl font-bold text-center mb-12 animated-underline-title font-orbitron">Our Sponsors</h2>
                <div className="flex flex-wrap justify-center items-center gap-8">
                {sponsorsData.map((sponsor) => (
                    <motion.div 
                        key={sponsor.name}
                        whileHover={{ scale: 1.1 }}
                        className="p-4 bg-slate-900/50 rounded-lg"
                    >
                    <img src={sponsor.logoUrl} alt={sponsor.name} className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    </motion.div>
                ))}
                </div>
            </section>
        </div>
    );
};

export default EventDetailsPage;