import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'framer-motion';
import Countdown from '../components/Countdown';
import type { FaqItem, Prize, ScheduleItem, Attraction } from '../types';
import { scheduleData, faqData, sponsorsData, attractionsData } from '../services/mockData';
import { TrophyIcon, MedalIcon, StarIcon, ChevronDownIcon, MapPinIcon, ScaleIcon, BookOpenIcon, UsersIcon, DollarSignIcon, HomeIcon, WandSparklesIcon, ClipboardCheckIcon, MegaphoneIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/IconComponents';
import GlowingCard from '../components/GlowingCard';
import { useTypewriter } from '../hooks/useTypewriter';
import { staggerContainer, fadeInUp, textRevealContainer, textRevealChild } from '../animations/framerVariants';
import { GlowButton, SlideUp } from '../components/AnimatedComponents';
import PixelTransition from '../components/PixelTransition';

interface LandingPageProps {
  setAppMode: (mode: 'user' | 'admin') => void;
  onAttractionClick: (attraction: Attraction) => void;
}

const prizes: Prize[] = [
    { rank: '1st Place', reward: '$5,000 + Tech Swag', icon: <TrophyIcon className="w-12 h-12 text-yellow-400" /> },
    { rank: '2nd Place', reward: '$2,500 + Gadgets', icon: <MedalIcon className="w-12 h-12 text-slate-300" /> },
    { rank: '3rd Place', reward: '$1,000 + Vouchers', icon: <StarIcon className="w-12 h-12 text-amber-500" /> },
];

const benefits = [
    { icon: <WandSparklesIcon className="w-8 h-8"/>, title: "Build Innovative Solutions", description: "Turn your brilliant ideas into reality. You'll have 36 hours to create a project that solves a real-world problem." },
    { icon: <UsersIcon className="w-8 h-8"/>, title: "Network with Experts", description: "Connect with industry professionals, experienced mentors, and fellow tech enthusiasts from diverse backgrounds." },
    { icon: <BookOpenIcon className="w-8 h-8"/>, title: "Learn & Grow", description: "Attend workshops on cutting-edge technologies and get 1-on-1 guidance to sharpen your technical and soft skills." },
    { icon: <TrophyIcon className="w-8 h-8"/>, title: "Win Epic Prizes", description: "Compete for a large prize pool, exclusive swag, and recognition from top tech companies and sponsors." },
];

const tracks = [
    { title: "AI / Machine Learning", description: "Dive into neural networks, NLP, and computer vision to build intelligent solutions.", imageUrl: "https://images.unsplash.com/photo-1599658880436-c61792e70672?q=80&w=800&auto=format&fit=crop" },
    { title: "Web 3.0 & Blockchain", description: "Explore the decentralized web with projects in DeFi, NFTs, and smart contracts.", imageUrl: "https://images.unsplash.com/photo-1642104704074-af0f44352a51?q=80&w=800&auto=format&fit=crop" },
    { title: "HealthTech", description: "Innovate for a healthier future by tackling challenges in diagnostics, accessibility, and patient care.", imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop" },
    { title: "Sustainability & Green Tech", description: "Develop solutions that address climate change, promote renewable energy, and support a circular economy.", imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop" },
];

const AttractionCarousel: React.FC<{ attractions: Attraction[]; onCardClick: (attraction: Attraction) => void; }> = ({ attractions, onCardClick }) => {
  const [[page, direction], setPage] = useState([0, 0]);

  const attractionIndex = ((page % attractions.length) + attractions.length) % attractions.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };
  
  const goToPage = (newPage: number) => {
    setPage([newPage, newPage > page ? 1 : -1]);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.7,
      rotateY: direction > 0 ? -60 : 60,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.7,
      rotateY: direction < 0 ? 60 : -60,
    }),
  };

  const currentAttraction = attractions[attractionIndex];

  return (
    <div style={{ perspective: '1200px' }} className="relative w-full max-w-4xl mx-auto h-[500px] flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
            scale: { duration: 0.4 },
            rotateY: { type: 'spring', stiffness: 200, damping: 30 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          onTap={() => onCardClick(currentAttraction)}
          className="absolute w-full h-full cursor-pointer"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <img 
              src={currentAttraction.imageUrl} 
              alt={currentAttraction.name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h3 className="text-3xl font-bold font-orbitron">{currentAttraction.name}</h3>
              <p className="mt-2 max-w-lg text-slate-300">{currentAttraction.shortDescription}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <motion.button
        onClick={() => paginate(-1)}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="absolute top-1/2 -translate-y-1/2 left-4 z-20 w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-500/50 text-white"
        aria-label="Previous attraction"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </motion.button>
      
      <motion.button
        onClick={() => paginate(1)}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="absolute top-1/2 -translate-y-1/2 right-4 z-20 w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-500/50 text-white"
        aria-label="Next attraction"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </motion.button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {attractions.map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              attractionIndex === i ? 'bg-cyan-400' : 'bg-slate-600/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};


const AnimatedTitle: React.FC<{ text: string }> = ({ text }) => {
    const words = text.split(" ");
    return (
        <motion.h2
            variants={textRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-3xl font-bold text-center mb-16 font-orbitron"
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    variants={textRevealChild}
                    className="inline-block mr-[0.25em]" // Adjust spacing between words
                >
                    {word}
                </motion.span>
            ))}
        </motion.h2>
    );
};

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
        <div className="flex items-center mb-3">
            <div className="bg-cyan-600/10 p-2 rounded-md mr-4 border border-cyan-500/20">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div className="text-slate-400 space-y-2">{children}</div>
    </GlowingCard>
);

const ParticleBackground: React.FC = React.memo(() => {
    const createStars = (count: number, size: number) => {
        let stars = [];
        for (let i = 0; i < count; i++) {
            const style = {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 2000}px`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: Math.random() * 0.5 + 0.5,
            };
            stars.push(<div key={i} className="star" style={style}></div>);
        }
        return stars;
    };
    return (
        <>
            <div id="stars">{createStars(50, 3)}</div>
            <div id="stars2">{createStars(100, 2)}</div>
            <div id="stars3">{createStars(200, 1)}</div>
        </>
    );
});


const TypewriterTitle: React.FC = () => {
    const title = "Innovate. Create. Inspire.";
    const { displayText, isComplete } = useTypewriter(title, 80);
    return (
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tighter font-orbitron">
            {displayText}
            <span className={`inline-block w-2 sm:w-3 md:w-4 h-10 sm:h-16 md:h-20 bg-cyan-400 ml-2 ${isComplete ? 'animate-[blink-cursor_1s_step-end_infinite]' : ''}`} aria-hidden="true"></span>
        </h1>
    );
};

const AnimatedTimelineItem: React.FC<{ item: ScheduleItem; index: number }> = ({ item, index }) => {
    const isEven = index % 2 === 0;

    const contentVariants: Variants = {
      hidden: { opacity: 0, x: isEven ? -50 : 50 },
      visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.1 } },
    };
    
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
            {/* Left Content */}
            <div className="w-1/2 pr-8 text-right">
                {isEven && content}
            </div>
            
            {/* Dot */}
            <motion.div 
                variants={dotVariants}
                whileHover={{ 
                    scale: 1.5, 
                    boxShadow: '0 0 20px #00BFFF, 0 0 30px #00BFFF' 
                }}
                className="timeline-dot absolute left-1/2 w-4 h-4 bg-cyan-400 rounded-full top-2 -translate-x-1/2 border-4 border-[#0D0B14] transition-shadow duration-300"
            />
            
            {/* Right Content */}
            <div className="w-1/2 pl-8 text-left">
                {!isEven && content}
            </div>
        </motion.div>
    );
};

const LandingPage: React.FC<LandingPageProps> = ({ setAppMode, onAttractionClick }) => {
  const hackathonStartDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
      target: heroRef,
      offset: ["start start", "end start"]
  });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);
  const yParticles = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);

  const timelineRef = useRef(null);
  const { scrollYProgress: timelineScrollYProgress } = useScroll({
      target: timelineRef,
      offset: ["start center", "end center"]
  });
  const pathHeight = useTransform(timelineScrollYProgress, [0, 1], [0, 1]);


  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* Hero Section */}
      <section ref={heroRef} className="relative text-center h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0D0B14] to-[#1e0a3c] animated-gradient-bg z-0"></div>
        <motion.div className="absolute inset-0 z-0" style={{ y: yParticles }}>
          <ParticleBackground />
        </motion.div>

        <motion.div 
            className="relative z-10 container mx-auto px-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            style={{ y: yText, opacity: opacityHero }}
        >
          <motion.div variants={fadeInUp} className="animate-float"><TypewriterTitle /></motion.div>
          <motion.p variants={fadeInUp} className="mt-4 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
            Join the brightest minds for 36 hours of non-stop building, learning, and fun.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-12 animate-float" style={{ animationDelay: '0.5s' }}>
            <Countdown targetDate={hackathonStartDate} />
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap justify-center gap-4">
            <GlowButton onClick={() => setAppMode('user')} className="cursor-target">
              Enter Participant Portal
            </GlowButton>
             <motion.button 
              onClick={() => setAppMode('admin')}
              whileHover={{ scale: 1.05, borderColor: 'rgb(34 211 238)', color: 'rgb(34 211 238)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="px-8 py-3 bg-slate-700/50 border border-purple-500/50 text-white font-bold rounded-lg cursor-target"
            >
              Enter Admin Portal
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
      
       {/* Why Join Section */}
       <section id="why-join" className="container mx-auto px-6">
            <AnimatedTitle text="Why Join Hackathon Fusion?" />
             <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {benefits.map((benefit) => (
                    <motion.div
                        key={benefit.title}
                        variants={fadeInUp}
                        className="h-full"
                    >
                        <div className="glowing-card h-full">
                            <div className="glowing-card-content p-8 text-center flex flex-col items-center">
                                <motion.div 
                                    className="relative w-20 h-20 mb-6 flex items-center justify-center"
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full opacity-30 blur-lg"></div>
                                    <div className="relative text-cyan-300 bg-slate-900 p-4 rounded-full border-2 border-slate-700">
                                        {benefit.icon}
                                    </div>
                                </motion.div>
                                <h3 className="font-bold text-white text-xl mb-2">{benefit.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed flex-grow">{benefit.description}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
       </section>
      
      {/* Schedule Section */}
      <section id="schedule" className="container mx-auto px-6">
        <AnimatedTitle text="Event Timeline" />
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
      
      {/* Tracks Section */}
      <section id="tracks" className="container mx-auto px-6">
          <AnimatedTitle text="Explore the Tracks" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tracks.map((track, i) => (
                  <SlideUp key={track.title} delay={i * 0.1}>
                      <PixelTransition
                        className="h-80"
                        pixelColor="#00BFFF"
                        firstContent={
                            <div className="relative w-full h-full">
                                <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-2xl font-bold font-orbitron">{track.title}</h3>
                                </div>
                            </div>
                        }
                        secondContent={
                            <div className="w-full h-full bg-[#100D1C] p-6 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold font-orbitron text-cyan-400">{track.title}</h3>
                                <p className="mt-2 text-sm text-slate-200">{track.description}</p>
                            </div>
                        }
                      />
                  </SlideUp>
              ))}
          </div>
      </section>

      {/* Prizes Section */}
      <section className="container mx-auto px-6">
        <AnimatedTitle text="Prizes & Recognition" />
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

       {/* Details Grid Section */}
      <section id="details" className="container mx-auto px-6">
        <AnimatedTitle text="Hackathon Guide" />
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

      {/* Location Section */}
      <section id="location" className="container mx-auto px-6">
        <AnimatedTitle text="Event Venue" />
        <SlideUp>
          <div className="relative max-w-5xl mx-auto rounded-xl overflow-hidden glowing-card">
            <div className="glowing-card-content !p-0 md:flex bg-[#100D1C]/80">
              {/* Left Side: Interactive Map */}
              <motion.div 
                className="md:w-1/2 relative overflow-hidden group cursor-pointer"
                whileHover="hover"
              >
                <motion.img 
                  src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1200&auto=format&fit=crop" 
                  alt="University Campus Aerial View" 
                  className="w-full h-64 md:h-full object-cover"
                  variants={{
                    initial: { scale: 1.1, filter: 'blur(0px)' },
                    hover: { scale: 1, filter: 'blur(2px)' }
                  }}
                  initial="initial"
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>

                {/* Map Pin */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{ y: ['-50%', '-55%', '-50%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <MapPinIcon className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,191,255,0.8)]" />
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-400/50 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 0, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  />
                </motion.div>

                {/* Venue Logo */}
                <motion.div 
                  className="absolute top-8 left-8 bg-black/50 backdrop-blur-sm p-4 rounded-lg border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <img 
                    src="https://pes.edu/wp-content/uploads/2022/10/pesulogo-white-300x128.png" 
                    alt="PES University Logo" 
                    className="w-32 h-auto"
                  />
                </motion.div>
              </motion.div>
              
              {/* Right Side: Venue Details */}
              <motion.div 
                className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <motion.h3 variants={fadeInUp} className="text-2xl lg:text-3xl font-bold font-orbitron text-white">PES Institute of Technology and Management</motion.h3>
                <motion.p variants={fadeInUp} className="text-slate-400 mt-4 leading-relaxed">
                  PES Campus, NH-206, Sagar Road<br/>
                  Shivamogga - 577204, Karnataka
                </motion.p>
                <motion.div variants={fadeInUp} className="mt-8">
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=PES+Institute+of+Technology+and+Management,Sagar+Road,Shivamogga"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <GlowButton onClick={() => {}} className="cursor-target">
                      View on Map
                    </GlowButton>
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </SlideUp>
      </section>
      
      {/* Explore the City Section */}
      <section id="explore" className="container mx-auto px-6">
        <AnimatedTitle text="Explore the City" />
        <AttractionCarousel 
          attractions={attractionsData} 
          onCardClick={onAttractionClick} 
        />
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 max-w-3xl">
          <AnimatedTitle text="Frequently Asked Questions" />
          <SlideUp>
              <div className="bg-[#100D1C]/50 border border-purple-800/60 rounded-lg p-4 backdrop-blur-sm">
                  {faqData.map((item, index) => <FaqAccordionItem key={index} item={item} />)}
              </div>
          </SlideUp>
      </section>

      {/* Sponsors Section */}
      <section className="container mx-auto px-6">
        <AnimatedTitle text="Our Sponsors" />
        <div className="relative w-full overflow-hidden py-8 mask-gradient">
          <div className="flex animate-scroll-logos">
            {[...sponsorsData, ...sponsorsData].map((sponsor, index) => (
              <div key={`${sponsor.name}-${index}`} className="flex-shrink-0 w-1/2 md:w-1/4 lg:w-1/5 px-8 flex justify-center items-center">
                <img
                  src={sponsor.logoUrl}
                  alt={sponsor.name}
                  className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;