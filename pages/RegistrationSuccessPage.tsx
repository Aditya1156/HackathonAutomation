import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Team } from '../types';
import { sendEmailNotification, sendWhatsAppNotification, sendSmsNotification } from '../services/notificationService';
import { CheckCircleIcon, XCircleIcon, CopyIcon, UserCircleIcon, TrophyIcon, FileTextIcon, StarIcon, MapPinIcon, CubeIcon } from '../components/IconComponents';
import { fadeInUp, staggerContainer } from '../animations/framerVariants';
import { GlowButton } from '../components/AnimatedComponents';
import { useToast } from '../hooks/useToast';


const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="confetti-piece" style={style}></div>
);

const Confetti: React.FC = () => {
  const confettiCount = 100;
  const colors = ['#7F00FF', '#00BFFF', '#FFD700', '#FF69B4', '#32CD32'];

  const pieces = Array.from({ length: confettiCount }).map((_, index) => {
    const style = {
      left: `${Math.random() * 100}%`,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      animationDelay: `${Math.random() * 4}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
    };
    return <ConfettiPiece key={index} style={style} />;
  });

  return <div className="confetti-container">{pieces}</div>;
};

const Spinner: React.FC<{className?: string}> = ({ className }) => (
    <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const NotificationStatusItem: React.FC<{
  status: 'sending' | 'sent' | 'failed';
  serviceName: string;
  onRetry?: () => void;
  errorDetails?: string | null;
}> = ({ status, serviceName, onRetry, errorDetails }) => {
    const statusMap = {
        sending: { icon: <Spinner className="text-slate-400"/>, text: `Sending ${serviceName}...`, color: 'text-slate-400' },
        sent: { icon: <CheckCircleIcon className="w-5 h-5 text-green-400"/>, text: `${serviceName} sent`, color: 'text-green-400' },
        failed: { icon: <XCircleIcon className="w-5 h-5 text-rose-400"/>, text: `Failed to send ${serviceName}`, color: 'text-rose-400' },
    };
    const currentStatus = statusMap[status];

    return (
        <div className="flex flex-col items-center sm:flex-row sm:justify-center gap-x-4 gap-y-1">
            <div className={`flex items-center space-x-2 text-sm ${currentStatus.color}`}>
                {currentStatus.icon}
                <span>{currentStatus.text}</span>
                 {status === 'failed' && onRetry && (
                    <button onClick={onRetry} className="text-xs text-cyan-400 hover:underline font-semibold">
                        (Retry)
                    </button>
                )}
            </div>
            {status === 'failed' && errorDetails && (
                <p className="text-xs text-rose-400 text-center sm:text-left">Reason: {errorDetails}</p>
            )}
        </div>
    );
};

interface RegistrationSuccessPageProps {
  team: Team;
  onProceed: () => void;
}

const RegistrationSuccessPage: React.FC<RegistrationSuccessPageProps> = ({ team, onProceed }) => {
    const [isCopiedId, setIsCopiedId] = useState(false);
    const [isCopiedPassword, setIsCopiedPassword] = useState(false);
    const [isCopiedTicket, setIsCopiedTicket] = useState(false);
    const [emailStatus, setEmailStatus] = useState<'sending' | 'sent' | 'failed'>('sending');
    const [whatsappStatus, setWhatsappStatus] = useState<'sending' | 'sent' | 'failed'>('sending');
    const [smsStatus, setSmsStatus] = useState<'sending' | 'sent' | 'failed'>('sending');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [whatsappError, setWhatsappError] = useState<string | null>(null);
    const [smsError, setSmsError] = useState<string | null>(null);
    const [showInviteCard, setShowInviteCard] = useState(true);
    const password = team.password!;
    const addToast = useToast();
    const allMembers = [team.leader, ...team.members];

    const handleSendEmail = useCallback(async () => {
        setEmailStatus('sending');
        setEmailError(null);
        try {
            await sendEmailNotification(team, password);
            setEmailStatus('sent');
            addToast('Confirmation email sent!', 'success');
        } catch (error: any) {
            setEmailStatus('failed');
            addToast('Failed to send confirmation email.', 'error');
            setEmailError(error.message || 'An unknown error occurred.');
            console.error(error);
        }
    }, [team, password, addToast]);

    const handleSendWhatsapp = useCallback(async () => {
        setWhatsappStatus('sending');
        setWhatsappError(null);
        try {
            await sendWhatsAppNotification(team, password);
            setWhatsappStatus('sent');
            addToast('WhatsApp confirmation sent!', 'success');
        } catch (error: any) {
            setWhatsappStatus('failed');
            addToast('Failed to send WhatsApp message.', 'error');
            setWhatsappError(error.message || 'An unknown error occurred.');
            console.error(error);
        }
    }, [team, password, addToast]);
    
    const handleSendSms = useCallback(async () => {
        setSmsStatus('sending');
        setSmsError(null);
        try {
            await sendSmsNotification(team, password);
            setSmsStatus('sent');
            addToast('SMS confirmation sent!', 'success');
        } catch (error: any) {
            setSmsStatus('failed');
            addToast('Failed to send SMS message.', 'error');
            setSmsError(error.message || 'An unknown error occurred.');
            console.error(error);
        }
    }, [team, password, addToast]);

    useEffect(() => {
        handleSendEmail();
        handleSendWhatsapp();
        handleSendSms();
    }, [handleSendEmail, handleSendWhatsapp, handleSendSms]);
    
    const handleCopy = (textToCopy: string, type: 'ID' | 'Password' | 'Ticket') => {
        navigator.clipboard.writeText(textToCopy);
        if (type === 'ID') {
            setIsCopiedId(true);
            setTimeout(() => setIsCopiedId(false), 2000);
        } else if (type === 'Password') {
            setIsCopiedPassword(true);
            setTimeout(() => setIsCopiedPassword(false), 2000);
        } else {
            setIsCopiedTicket(true);
            setTimeout(() => setIsCopiedTicket(false), 2000);
        }
        addToast(`${type} copied to clipboard!`, 'info');
    };
    
    const memberCardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 }
    };

    return (
         <motion.div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
        >
            <Confetti />
            
            {/* Main Success Card */}
            <motion.div
                className="w-full max-w-6xl relative z-10"
                variants={fadeInUp}
            >
                {/* Invitation Card */}
                <AnimatePresence>
                    {showInviteCard && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, rotateY: -10 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.8 }}
                            className="bg-gradient-to-br from-purple-900/40 via-slate-900/90 to-cyan-900/40 rounded-3xl border-2 border-purple-500/50 backdrop-blur-xl shadow-2xl shadow-purple-900/50 overflow-hidden mb-6"
                        >
                            {/* Decorative Top Pattern */}
                            <div className="h-2 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500"></div>
                            
                            <div className="p-8 md:p-12">
                                {/* Trophy & Success Message */}
                                <motion.div 
                                    className="text-center mb-8"
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <motion.div
                                        animate={{ 
                                            rotate: [0, -10, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="inline-block"
                                    >
                                        <TrophyIcon className="w-20 h-20 text-yellow-400 mx-auto drop-shadow-lg"/>
                                    </motion.div>
                                    
                                    <motion.h1
                                        className="text-5xl md:text-6xl font-bold font-orbitron text-white mt-4 mb-3"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4, type: 'spring' }}
                                    >
                                        🎉 Congratulations! 🎉
                                    </motion.h1>
                                    
                                    <motion.p 
                                        className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        {team.name}
                                    </motion.p>
                                    
                                    <motion.p
                                        className="text-slate-300 mt-2 text-lg"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        You're officially registered for the hackathon!
                                    </motion.p>
                                </motion.div>

                                {/* Decorative Divider */}
                                <motion.div 
                                    className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-8"
                                    initial={{ width: 0 }}
                                    animate={{ width: 128 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                />

                                {/* Team Details Grid */}
                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    {/* Left Column - Team Info */}
                                    <motion.div
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.9 }}
                                        className="space-y-4"
                                    >
                                        <div className="bg-slate-800/60 rounded-xl p-6 border border-purple-500/30">
                                            <h3 className="text-cyan-400 font-bold text-lg mb-4 flex items-center">
                                                <CubeIcon className="w-5 h-5 mr-2" />
                                                Team Information
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <span className="text-slate-400">Track:</span>
                                                    <p className="text-white font-semibold">{team.track}</p>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">College:</span>
                                                    <p className="text-white font-semibold">{team.collegeName}</p>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 flex items-center">
                                                        <MapPinIcon className="w-4 h-4 mr-1" />
                                                        Location:
                                                    </span>
                                                    <p className="text-white font-semibold">{team.city}</p>
                                                </div>
                                                {team.accommodation && (
                                                    <div className="mt-2 px-3 py-2 bg-amber-500/20 border border-amber-500/40 rounded-lg">
                                                        <p className="text-amber-300 text-xs font-semibold">🏠 Accommodation Required</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Credentials */}
                                        <div className="bg-slate-800/60 rounded-xl p-6 border border-green-500/30 space-y-3">
                                            <h3 className="text-green-400 font-bold text-lg mb-4">🔐 Your Credentials</h3>
                                            
                                            <div>
                                                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Team ID</label>
                                                <div className="flex items-center mt-1 bg-slate-900 rounded-lg p-2">
                                                    <span className="font-mono text-white font-bold flex-grow">{team.id}</span>
                                                    <button onClick={() => handleCopy(team.id, 'ID')} className="ml-2 p-1.5 hover:bg-slate-700 rounded transition-colors">
                                                        {isCopiedId ? <CheckCircleIcon className="w-4 h-4 text-green-400"/> : <CopyIcon className="w-4 h-4 text-slate-400"/>}
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Password</label>
                                                <div className="flex items-center mt-1 bg-slate-900 rounded-lg p-2">
                                                    <span className="font-mono text-white font-bold flex-grow">{password}</span>
                                                    <button onClick={() => handleCopy(password, 'Password')} className="ml-2 p-1.5 hover:bg-slate-700 rounded transition-colors">
                                                        {isCopiedPassword ? <CheckCircleIcon className="w-4 h-4 text-green-400"/> : <CopyIcon className="w-4 h-4 text-slate-400"/>}
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide flex items-center">
                                                    <FileTextIcon className="w-3 h-3 mr-1" />
                                                    Submission Ticket
                                                </label>
                                                <div className="flex items-center mt-1 bg-slate-900 rounded-lg p-2">
                                                    <span className="font-mono text-white text-xs flex-grow">{team.submissionTicket}</span>
                                                    <button onClick={() => handleCopy(team.submissionTicket!, 'Ticket')} className="ml-2 p-1.5 hover:bg-slate-700 rounded transition-colors">
                                                        {isCopiedTicket ? <CheckCircleIcon className="w-4 h-4 text-green-400"/> : <CopyIcon className="w-4 h-4 text-slate-400"/>}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                                <p className="text-amber-300 text-xs">⚠️ Save these credentials! You'll need them to access your dashboard.</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Right Column - Team Members */}
                                    <motion.div
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="bg-slate-800/60 rounded-xl p-6 border border-cyan-500/30"
                                    >
                                        <h3 className="text-cyan-400 font-bold text-lg mb-6 flex items-center">
                                            <StarIcon className="w-5 h-5 mr-2" />
                                            Your Amazing Team
                                        </h3>
                                        
                                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                            {allMembers.map((member, index) => (
                                                <motion.div
                                                    key={member.email}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 1.1 + index * 0.1 }}
                                                    className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-cyan-500/50 transition-all"
                                                >
                                                    <div className="flex items-start space-x-4">
                                                        <div className="relative flex-shrink-0">
                                                            {member.profilePictureUrl ? (
                                                                <img 
                                                                    src={member.profilePictureUrl} 
                                                                    alt={member.name} 
                                                                    className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500/50 shadow-lg"
                                                                />
                                                            ) : (
                                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center border-2 border-cyan-500/50">
                                                                    <UserCircleIcon className="w-10 h-10 text-white" />
                                                                </div>
                                                            )}
                                                            {index === 0 && (
                                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-slate-900">
                                                                    <span className="text-xs">👑</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <h4 className="font-bold text-white truncate">{member.name}</h4>
                                                                {index === 0 && (
                                                                    <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-full font-semibold">Leader</span>
                                                                )}
                                                            </div>
                                                            <p className="text-slate-400 text-sm truncate">{member.email}</p>
                                                            <p className="text-slate-500 text-xs mt-1">{member.contactNumber}</p>
                                                            {member.skills && member.skills.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {member.skills.map((skill, idx) => (
                                                                        <span key={idx} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Notification Status */}
                                <motion.div 
                                    className="bg-slate-800/40 rounded-xl p-6 border border-purple-500/20 mb-6"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                >
                                    <h3 className="text-slate-300 font-semibold text-center mb-4">📨 Notification Status</h3>
                                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                        <NotificationStatusItem 
                                            status={emailStatus} 
                                            serviceName="Email"
                                            onRetry={handleSendEmail}
                                            errorDetails={emailError}
                                        />
                                        <NotificationStatusItem 
                                            status={whatsappStatus} 
                                            serviceName="WhatsApp"
                                            onRetry={handleSendWhatsapp}
                                            errorDetails={whatsappError}
                                        />
                                        <NotificationStatusItem 
                                            status={smsStatus} 
                                            serviceName="SMS"
                                            onRetry={handleSendSms}
                                            errorDetails={smsError}
                                        />
                                    </div>
                                </motion.div>

                                {/* Action Button */}
                                <motion.div 
                                    className="text-center"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3 }}
                                >
                                    <GlowButton onClick={onProceed} className="px-12 py-4 text-xl">
                                        🚀 Proceed to Dashboard
                                    </GlowButton>
                                    <p className="text-slate-400 text-sm mt-4">
                                        Ready to start building something amazing? Let's go!
                                    </p>
                                </motion.div>
                            </div>
                            
                            {/* Decorative Bottom Pattern */}
                            <div className="h-2 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500"></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default RegistrationSuccessPage;