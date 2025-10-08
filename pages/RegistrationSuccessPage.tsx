import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Team } from '../types';
import { sendEmailNotification, sendWhatsAppNotification, sendSmsNotification } from '../services/notificationService';
import { CheckCircleIcon, XCircleIcon, CopyIcon, UserCircleIcon, TrophyIcon, FileTextIcon } from '../components/IconComponents';
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
            className="min-h-screen flex items-center justify-center p-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
        >
            <Confetti />
            <motion.div
                className="w-full max-w-4xl bg-slate-900/50 rounded-2xl border-2 border-purple-500/30 backdrop-blur-lg shadow-2xl shadow-purple-900/20 text-center p-8 md:p-12 glowing-card"
                variants={fadeInUp}
            >
                 <div className="glowing-card-content !bg-transparent !p-0">
                    <motion.div variants={fadeInUp} className="text-yellow-400 mb-4">
                        <TrophyIcon className="w-16 h-16 mx-auto"/>
                    </motion.div>
                    <motion.h2
                        variants={fadeInUp}
                        className="text-4xl sm:text-5xl font-bold font-orbitron text-white"
                    >
                        Congratulations!
                    </motion.h2>

                    <motion.p variants={fadeInUp} className="text-slate-300 mt-3 text-lg">
                        Welcome, <span className="font-bold text-cyan-400">{team.name}</span>. You're officially registered!
                    </motion.p>

                    <motion.div variants={fadeInUp} className="w-24 h-1 bg-cyan-400 mx-auto mt-6 mb-8 rounded-full" />
                    
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-left">
                        <motion.h3 variants={fadeInUp} className="font-bold text-xl text-cyan-400 mb-4">Your Crew</motion.h3>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                            {allMembers.map((member, index) => (
                                <motion.div
                                    key={member.email}
                                    variants={memberCardVariants}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 + index * 0.1 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="relative">
                                        {member.profilePictureUrl ? (
                                            <img src={member.profilePictureUrl} alt={member.name} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-slate-700 shadow-lg"/>
                                        ) : (
                                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-600">
                                                <UserCircleIcon className="w-12 h-12 text-slate-500" />
                                            </div>
                                        )}
                                        {index === 0 && (
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-bold text-cyan-300 bg-cyan-900/80 border border-cyan-500/50 rounded-full">LEADER</div>
                                        )}
                                    </div>
                                    <p className="mt-3 font-semibold text-white text-sm md:text-base">{member.name}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    
                    <motion.div variants={fadeInUp} className="mt-8 space-y-4 text-left text-sm">
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <label className="text-slate-400 font-semibold">Team ID</label>
                            <div className="flex items-center mt-1">
                                <span className="font-mono bg-slate-700 px-2 py-1 rounded text-white flex-grow">{team.id}</span>
                                <button onClick={() => handleCopy(team.id, 'ID')} className="p-1.5 ml-2 text-slate-400 hover:text-white transition-colors">
                                    {isCopiedId ? <CheckCircleIcon className="w-4 h-4 text-green-400"/> : <CopyIcon className="w-4 h-4"/>}
                                </button>
                            </div>
                        </div>
                         <div className="bg-slate-800/50 p-4 rounded-lg">
                            <label className="text-slate-400 font-semibold">Password</label>
                             <div className="flex items-center mt-1">
                                <span className="font-mono bg-slate-700 px-2 py-1 rounded text-white flex-grow">{password}</span>
                                <button onClick={() => handleCopy(password, 'Password')} className="p-1.5 ml-2 text-slate-400 hover:text-white transition-colors">
                                    {isCopiedPassword ? <CheckCircleIcon className="w-4 h-4 text-green-400"/> : <CopyIcon className="w-4 h-4"/>}
                                </button>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <label className="text-slate-400 font-semibold flex items-center">
                                <FileTextIcon className="w-4 h-4 mr-2" />
                                File Submission Ticket
                            </label>
                             <div className="flex items-center mt-1">
                                <span className="font-mono bg-slate-700 px-2 py-1 rounded text-white flex-grow">{team.submissionTicket}</span>
                                <button onClick={() => handleCopy(team.submissionTicket!, 'Ticket')} className="p-1.5 ml-2 text-slate-400 hover:text-white transition-colors">
                                    {isCopiedTicket ? <CheckCircleIcon className="w-4 h-4 text-green-400"/> : <CopyIcon className="w-4 h-4"/>}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                    
                     <motion.div variants={fadeInUp} className="mt-4 flex flex-col items-center justify-center gap-y-2">
                         <NotificationStatusItem 
                            status={emailStatus} 
                            serviceName="Confirmation Email"
                            onRetry={handleSendEmail}
                            errorDetails={emailError}
                        />
                         <NotificationStatusItem 
                            status={whatsappStatus} 
                            serviceName="WhatsApp Message"
                            onRetry={handleSendWhatsapp}
                            errorDetails={whatsappError}
                        />
                         <NotificationStatusItem 
                            status={smsStatus} 
                            serviceName="SMS Notification"
                            onRetry={handleSendSms}
                            errorDetails={smsError}
                        />
                     </motion.div>

                    <motion.div variants={fadeInUp} className="mt-10">
                        <GlowButton onClick={onProceed} className="px-10 py-4 text-xl">
                            Proceed to Dashboard
                        </GlowButton>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RegistrationSuccessPage;