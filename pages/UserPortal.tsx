import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Team, TeamMember } from '../types';
import { generateProjectIdeas } from '../services/geminiService';
import { fetchGithubUser, searchGithubUsers } from '../services/githubService';
import { CheckCircleIcon, TrophyIcon, UserCircleIcon, UsersIcon, WandSparklesIcon, BookOpenIcon, XIcon, CopyIcon, XCircleIcon, UploadCloudIcon, InfoIcon, BrainCircuitIcon, CubeIcon, HeartPulseIcon, BanknotesIcon, LeafIcon, FileTextIcon, ChevronDownIcon, PencilIcon } from '../components/IconComponents';
import { staggerContainer, fadeInUp } from '../animations/framerVariants';
import { GlowButton } from '../components/AnimatedComponents';
import { useToast } from '../hooks/useToast';

interface RegistrationProps {
  onRegistrationComplete: (team: Team) => void;
}

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-cyan-400">Step {currentStep + 1} of {totalSteps}</span>
                <span className="text-sm font-semibold text-white">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                    className="bg-gradient-to-r from-purple-600 to-cyan-500 h-2 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                />
            </div>
        </div>
    );
};

const StepHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-slate-400 mt-1">{subtitle}</p>
    </div>
);


const ProfileImageUploader: React.FC<{ imageUrl?: string; onImageSelect: (url: string) => void; onImageRemove: () => void; }> = ({ imageUrl, onImageSelect, onImageRemove }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const addToast = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                onImageSelect(reader.result as string);
                addToast('Profile picture updated!', 'success');
            };
            reader.readAsDataURL(file);
        }
        event.target.value = ''; // Allow re-uploading the same file
    };

    return (
        <div className="relative group flex-shrink-0">
             <div 
                className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-slate-500 hover:border-cyan-400 transition-colors"
                onClick={() => inputRef.current?.click()}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <UserCircleIcon className="w-12 h-12 text-slate-500" />
                )}
            </div>
            {imageUrl && (
                 <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); onImageRemove(); }}
                    className="absolute -top-1 -right-1 p-1 bg-rose-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <XIcon className="w-3 h-3" />
                </button>
            )}
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/*,.jpeg,.jpg,.png,.gif"
                onChange={handleFileChange}
            />
        </div>
    );
};

const VerticalStepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = [
        { num: 0, title: 'Team Identity', icon: <WandSparklesIcon className="w-5 h-5" /> },
        { num: 1, title: 'Team Info', icon: <InfoIcon className="w-5 h-5" /> },
        { num: 2, title: 'Member Details', icon: <UsersIcon className="w-5 h-5" /> },
        { num: 3, title: 'Project Details', icon: <BookOpenIcon className="w-5 h-5" /> },
        { num: 4, title: 'Final Touches', icon: <CheckCircleIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="flex flex-col justify-center space-y-8 relative">
            {steps.map((step) => (
                <div key={step.num} className="flex items-center z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        currentStep >= step.num ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-700 border-slate-600'
                    }`}>
                        {step.icon}
                    </div>
                    <div className="ml-4">
                        <div className={`text-sm uppercase tracking-wider ${currentStep >= step.num ? 'text-cyan-400' : 'text-slate-500'}`}>Step {step.num + 1}</div>
                        <div className={`font-bold ${currentStep >= step.num ? 'text-white' : 'text-slate-400'}`}>{step.title}</div>
                    </div>
                </div>
            ))}
             <div className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-slate-600" />
             <motion.div 
                className="absolute left-5 top-5 h-0 w-0.5 bg-cyan-500 transition-all duration-500" 
                style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
             />
        </div>
    );
};

// Sub-components for each step for clarity
const ModernFormInput: React.FC<any> = ({ id, label, value, onChange, onBlur, error, isSuccess, ...props }) => {
    const borderColor = error
        ? 'border-rose-500 focus:border-rose-500'
        : isSuccess
        ? 'border-green-500 focus:border-green-500'
        : 'border-purple-500/30 focus:border-cyan-400';

    return (
        <div className="relative">
            <input
                id={id}
                value={value}
                onChange={e => onChange(e.target.value)}
                onBlur={onBlur}
                className={`peer w-full p-3 pt-6 bg-slate-800/50 border-2 rounded-lg outline-none transition-colors duration-300 placeholder-transparent ${borderColor}`}
                placeholder={label}
                {...props}
            />
            <label
                htmlFor={id}
                className="absolute left-3 top-1 text-xs text-slate-400 transition-all duration-200
                  peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
                  peer-focus:top-1 peer-focus:text-xs peer-focus:text-cyan-400"
            >
                {label}
            </label>
             {isSuccess && !error && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1/2 right-3 -translate-y-1/2 text-green-400">
                    <CheckCircleIcon className="w-5 h-5" />
                </motion.div>
            )}
            {error && <p className="text-rose-400 text-sm mt-1">{error}</p>}
        </div>
    );
};

const FormSelect: React.FC<any> = ({ id, label, value, onChange, onBlur, error, isSuccess, children }) => {
     const borderColor = error
        ? 'border-rose-500/80 focus:ring-rose-500'
        : isSuccess
        ? 'border-green-500/80 focus:ring-green-500'
        : 'border-purple-500/30 focus:ring-cyan-500';

    return (
        <div className="relative">
            {label && <label htmlFor={id} className="block mb-2 text-sm font-medium text-slate-300">{label}</label>}
            <select id={id} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} className={`w-full p-3 bg-slate-800 border-2 rounded-lg focus:ring-2 focus:border-transparent transition-colors ${borderColor}`}>
                {children}
            </select>
            {isSuccess && !error && (
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1/2 right-3 -translate-y-1/2 text-green-400 pointer-events-none">
                    <CheckCircleIcon className="w-5 h-5" />
                </motion.div>
            )}
            {error && <p className="text-rose-400 text-sm mt-1">{error}</p>}
        </div>
    );
};


const TeamLogoUploader: React.FC<{ imageUrl?: string; onImageSelect: (url: string) => void; }> = ({ imageUrl, onImageSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const addToast = useToast();

    const handleFile = useCallback((file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                onImageSelect(reader.result as string);
                addToast('Team logo uploaded!', 'success');
            };
            reader.readAsDataURL(file);
        } else {
            addToast('Please upload a valid image file.', 'error');
        }
    }, [onImageSelect, addToast]);

    const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = '';
    };

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-all duration-300
                ${isDragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-purple-500/30 hover:border-cyan-400 hover:bg-slate-800/50'}
                ${imageUrl ? 'border-solid !border-cyan-500/50' : ''}`}
        >
            <AnimatePresence>
                {imageUrl ? (
                    <motion.div key="image" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full">
                        <img src={imageUrl} alt="Team Logo Preview" className="w-full h-full object-contain rounded-md" />
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white font-semibold">Click or drop to replace logo</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="placeholder" exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center justify-center text-slate-400">
                        <UploadCloudIcon className="w-12 h-12 mb-2" />
                        <p className="font-semibold">Drop your team logo here</p>
                        <p className="text-sm">or click to browse (PNG, JPG)</p>
                    </motion.div>
                )}
            </AnimatePresence>
            <input type="file" ref={inputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
    );
};

const AnimatedCharacterInput: React.FC<{ value: string; onChange: (v: string) => void; onBlur: () => void; label: string; maxLength: number; error?: string, isSuccess?: boolean }> = ({ value, onChange, onBlur, label, maxLength, error, isSuccess }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.focus();
    };

    const containerVariants = {
        visible: { transition: { staggerChildren: 0.03 } },
    };

    const charVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    const borderColor = error
        ? 'border-rose-500'
        : isSuccess
        ? 'border-green-500'
        : 'border-purple-500/30 focus-within:border-cyan-400';

    return (
        <div className="w-full">
            <label htmlFor="teamNameInput" className="block mb-4 text-lg font-medium text-slate-300 text-center">{label}</label>
            <div
                onClick={handleClick}
                className={`relative w-full max-w-md mx-auto h-24 p-4 flex items-center justify-center text-center bg-slate-900/50 border-2 rounded-lg cursor-text group
                  transition-colors duration-300 ${borderColor}`}
            >
                <input
                    id="teamNameInput"
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    maxLength={maxLength}
                    className="absolute inset-0 w-full h-full bg-transparent text-transparent border-none outline-none caret-transparent"
                    aria-label={label}
                />
                <motion.div
                    key={value}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex font-orbitron text-4xl font-bold tracking-widest text-white"
                    aria-hidden="true"
                >
                    {value.split('').map((char, index) => (
                        <motion.span key={`${char}-${index}`} variants={charVariants}>
                            {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                    ))}
                    <motion.span
                        className="w-1 h-10 bg-cyan-400 ml-1 rounded-full opacity-0 group-focus-within:opacity-100"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>
                {!value && (
                    <p className="absolute text-slate-500 text-2xl font-orbitron pointer-events-none">
                        TYPE HERE...
                    </p>
                )}
                 {isSuccess && !error && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1/2 right-3 -translate-y-1/2 text-green-400">
                        <CheckCircleIcon className="w-6 h-6" />
                    </motion.div>
                )}
            </div>
            {error && <p className="text-rose-400 text-sm mt-2 text-center">{error}</p>}
        </div>
    );
};

const Step0TeamIdentity: React.FC<any> = ({ teamName, setTeamName, teamLogoUrl, setTeamLogoUrl, errors, onNext, handleBlur, touched }) => (
    <div className="flex flex-col items-center space-y-8">
        <StepHeader title="Forge Your Team's Identity" subtitle="Every great project starts with a name. Make it legendary."/>
        
        <div className="w-full max-w-md">
            <AnimatedCharacterInput 
                label="Team Name" 
                value={teamName} 
                onChange={(val: string) => setTeamName(val.toUpperCase())}
                onBlur={() => handleBlur('teamName')}
                error={errors.teamName}
                isSuccess={touched.teamName && !errors.teamName}
                maxLength={20}
            />
        </div>
        
        <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Team Logo (Optional)</label>
            <TeamLogoUploader imageUrl={teamLogoUrl} onImageSelect={setTeamLogoUrl} />
        </div>
        
        <div className="mt-8">
            <GlowButton onClick={onNext} className="px-10 py-3 text-lg">
                Provide Team Details
            </GlowButton>
        </div>
    </div>
);


const tracks = [
    { name: 'AI / Machine Learning', icon: <BrainCircuitIcon className="w-5 h-5" /> },
    { name: 'Web 3.0 & Blockchain', icon: <CubeIcon className="w-5 h-5" /> },
    { name: 'FinTech', icon: <BanknotesIcon className="w-5 h-5" /> },
    { name: 'HealthTech', icon: <HeartPulseIcon className="w-5 h-5" /> },
    { name: 'Sustainability & Green Tech', icon: <LeafIcon className="w-5 h-5" /> }
];

const TrackDropdown: React.FC<{ selectedTrack: string; onSelect: (track: string) => void; onBlur: () => void; error?: string, isSuccess?: boolean }> = ({ selectedTrack, onSelect, onBlur, error, isSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const addToast = useToast();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                onBlur();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onBlur]);

    const handleSelect = (trackName: string) => {
        onSelect(trackName);
        setIsOpen(false);
        addToast(`Track selected: ${trackName}`, 'info');
    };

    const selectedTrackData = tracks.find(t => t.name === selectedTrack);
    const borderColor = error ? 'border-rose-500/80' : isSuccess ? 'border-green-500/80' : 'border-purple-500/30';

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block mb-2 text-sm font-medium text-slate-300">Select Your Track</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onBlur={onBlur}
                className={`w-full flex justify-between items-center p-3 bg-slate-800 border-2 rounded-lg transition-all ${borderColor} ${isOpen ? 'ring-2 ring-cyan-500' : ''}`}
            >
                {selectedTrackData ? (
                    <span className="flex items-center space-x-2">
                        {selectedTrackData.icon}
                        <span>{selectedTrackData.name}</span>
                    </span>
                ) : (
                    <span className="text-slate-400">-- Choose a track --</span>
                )}
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSuccess && !error && (
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-10 right-12 text-green-400 pointer-events-none">
                    <CheckCircleIcon className="w-5 h-5" />
                </motion.div>
            )}
            {error && <p className="text-rose-400 text-sm mt-1">{error}</p>}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-1 bg-slate-900 border border-purple-500/50 rounded-lg shadow-xl overflow-hidden"
                    >
                        {tracks.map(track => (
                            <button
                                type="button"
                                key={track.name}
                                onClick={() => handleSelect(track.name)}
                                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-purple-500/20 transition-colors"
                            >
                                {track.icon}
                                <span className="font-semibold">{track.name}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FileUploader: React.FC<{ fileUrl?: string; onFileSelect: (url: string) => void; onFileRemove: () => void; }> = ({ fileUrl, onFileSelect, onFileRemove }) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const addToast = useToast();
    const [fileName, setFileName] = useState<string | null>(null);

    useEffect(() => {
        if (fileUrl) {
            setFileName('Uploaded College ID'); // Display generic name for data URLs
        } else {
            setFileName(null);
        }
    }, [fileUrl]);

    const handleFile = useCallback((file: File) => {
        if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
            const reader = new FileReader();
            reader.onload = () => {
                onFileSelect(reader.result as string);
                addToast('ID Card uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
        } else {
            addToast('Please upload an image or PDF file.', 'error');
        }
    }, [onFileSelect, addToast]);

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileRemove();
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Upload College ID (Optional)</label>
            <div
                onClick={() => inputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative w-full p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
                    ${isDragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-purple-500/30 hover:border-cyan-400 hover:bg-slate-800/50'}`}
            >
                <input type="file" ref={inputRef} className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
                {fileName ? (
                    <div className="flex flex-col items-center text-center">
                        <FileTextIcon className="w-10 h-10 text-green-400 mb-2" />
                        <p className="font-semibold text-white break-all">{fileName}</p>
                        <button onClick={handleRemove} className="mt-2 text-sm text-rose-400 hover:underline">Remove file</button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-slate-400">
                        <UploadCloudIcon className="w-10 h-10 mb-2" />
                        <p className="font-semibold">Drop your ID card file here</p>
                        <p className="text-sm">(Image or PDF)</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Step1TeamInfo: React.FC<any> = ({ track, setTrack, collegeName, setCollegeName, city, setCity, address, setAddress, institutionIdUrl, setInstitutionIdUrl, errors, onBack, onNext, handleBlur, touched }) => (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <StepHeader title="Team Information" subtitle="Tell us more about your team's background and origin." />
        <div className="space-y-6">
            <motion.div variants={fadeInUp}>
                <TrackDropdown selectedTrack={track} onSelect={setTrack} onBlur={() => handleBlur('track')} error={errors?.track} isSuccess={touched.track && !errors?.track} />
            </motion.div>
            <motion.div variants={fadeInUp}>
                <ModernFormInput id="collegeName" label="College/University Name" value={collegeName} onChange={setCollegeName} onBlur={() => handleBlur('collegeName')} error={errors?.collegeName} isSuccess={touched.collegeName && !errors?.collegeName} />
            </motion.div>
            <motion.div variants={fadeInUp}>
                <ModernFormInput id="city" label="City, State" value={city} onChange={setCity} onBlur={() => handleBlur('city')} error={errors?.city} isSuccess={touched.city && !errors?.city} />
            </motion.div>
            <motion.div variants={fadeInUp}>
                <ModernFormInput id="address" label="Full Address (Optional)" value={address} onChange={setAddress} onBlur={() => handleBlur('address')} error={errors?.address} isSuccess={touched.address && !errors?.address} placeholder="For accommodation planning" />
            </motion.div>
            <motion.div variants={fadeInUp}>
                <FileUploader
                    fileUrl={institutionIdUrl}
                    onFileSelect={(url) => setInstitutionIdUrl(url)}
                    onFileRemove={() => setInstitutionIdUrl(undefined)}
                />
            </motion.div>
        </div>
        <div className="flex justify-between mt-8">
            <button type="button" onClick={onBack} className="px-6 py-2 bg-slate-600/50 border border-slate-500 rounded-lg hover:bg-slate-600/80 transition-colors">Back</button>
            <GlowButton onClick={onNext}>Next: Member Details</GlowButton>
        </div>
    </motion.div>
);


const MemberInputRow: React.FC<any> = ({ member, onMemberChange, onImageSelect, onImageRemove, onBlur, isLeader, onRemove, errors, touched }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-slate-900/30 p-4 rounded-lg border border-purple-500/30 relative"
        >
            {isLeader && (
                <div className="absolute -top-3 left-4 px-2 py-0.5 text-xs font-bold text-cyan-300 bg-cyan-900/80 border border-cyan-500/50 rounded-full">
                    LEADER
                </div>
            )}
            {!isLeader && (
                 <button 
                    type="button" 
                    onClick={onRemove}
                    className="absolute -top-2 -right-2 p-1.5 bg-rose-600 rounded-full text-white hover:bg-rose-500 transition-colors"
                    aria-label="Remove Member"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            )}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <ProfileImageUploader 
                    imageUrl={member.profilePictureUrl} 
                    onImageSelect={onImageSelect}
                    onImageRemove={onImageRemove}
                />
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <ModernFormInput label={`${isLeader ? "Leader's" : "Member's"} Name`} value={member.name} onChange={(v: string) => onMemberChange('name', v.toUpperCase())} onBlur={() => onBlur('name')} error={errors?.name} isSuccess={touched?.name && !errors?.name} />
                    <ModernFormInput type="email" label="Email Address" value={member.email} onChange={(v: string) => onMemberChange('email', v)} onBlur={() => onBlur('email')} error={errors?.email} isSuccess={touched?.email && !errors?.email}/>
                    <ModernFormInput 
                        type="tel" 
                        label="Contact Number"
                        value={member.contactNumber} 
                        onChange={(v: string) => {
                            const numericValue = v.replace(/[^0-9]/g, '');
                            if (numericValue.length <= 10) {
                                onMemberChange('contactNumber', numericValue);
                            }
                        }}
                        onBlur={() => onBlur('contactNumber')}
                        error={errors?.contactNumber}
                        isSuccess={touched?.contactNumber && !errors?.contactNumber}
                        maxLength="10" 
                    />
                    <ModernFormInput type="url" label="GitHub Profile URL (optional)" value={member.githubUrl} onChange={(v: string) => onMemberChange('githubUrl', v)} onBlur={() => onBlur('githubUrl')} error={errors?.githubUrl} isSuccess={touched?.githubUrl && !errors?.githubUrl}/>
                    <div className="sm:col-span-2">
                      <FormSelect id="tshirtSize" label="T-Shirt Size" value={member.tshirtSize} onChange={(v: string) => onMemberChange('tshirtSize', v)} onBlur={() => onBlur('tshirtSize')}>
                        <option value="S">Small (S)</option>
                        <option value="M">Medium (M)</option>
                        <option value="L">Large (L)</option>
                        <option value="XL">Extra Large (XL)</option>
                        <option value="XXL">XX-Large (XXL)</option>
                      </FormSelect>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Step2MemberDetails: React.FC<any> = ({ leader, setLeader, members, handleMemberChange, handleAddMember, handleRemoveMember, errors, onBack, onNext, handleBlur, touched }) => {
    const totalMembers = 1 + members.length;
    const maxMembers = 5;
    const leaderErrors = errors.leader || {};
    const memberErrors = errors.members || [];
    const leaderTouched = touched.leader || {};
    const membersTouched = touched.members || [];


    return (
        <div>
            <div className="flex justify-between items-center">
                <StepHeader title="Assemble Your Team" subtitle="A great team is the key to success. Add your members here."/>
                <div className="px-3 py-1 text-sm font-semibold text-cyan-300 bg-slate-800/50 border border-purple-500/30 rounded-full mb-8">
                    {totalMembers} / {maxMembers} Members
                </div>
            </div>
            
            <div className="space-y-6">
                 {/* Leader Row */}
                 <MemberInputRow
                    member={leader}
                    onMemberChange={(field: keyof TeamMember, value: string) => setLeader({...leader, [field]: value})}
                    onImageSelect={(url: string) => setLeader({...leader, profilePictureUrl: url})}
                    onImageRemove={() => setLeader({...leader, profilePictureUrl: undefined})}
                    onBlur={(field: keyof TeamMember) => handleBlur(`leader.${field}`)}
                    isLeader={true}
                    errors={leaderErrors}
                    touched={leaderTouched}
                 />

                {/* Member Rows with Animation */}
                <AnimatePresence>
                    {members.map((member: TeamMember, index: number) => (
                        <MemberInputRow
                            key={index} // Simple key for this use-case
                            member={member}
                            onMemberChange={(field: keyof TeamMember, value: string) => handleMemberChange(index, field, value)}
                            onImageSelect={(url: string) => handleMemberChange(index, 'profilePictureUrl', url)}
                            onImageRemove={() => handleMemberChange(index, 'profilePictureUrl', undefined)}
                            onBlur={(field: keyof TeamMember) => handleBlur(`members.${index}.${field}`)}
                            onRemove={() => handleRemoveMember(index)}
                            isLeader={false}
                            errors={memberErrors[index] || {}}
                            touched={membersTouched[index] || {}}
                        />
                    ))}
                </AnimatePresence>

                {totalMembers < maxMembers && (
                    <motion.button 
                        type="button" 
                        onClick={handleAddMember} 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-cyan-300 border-2 border-dashed border-slate-600 hover:border-cyan-400 hover:text-white transition-colors rounded-lg py-3 font-semibold"
                    >
                        + Add Another Member
                    </motion.button>
                )}
            </div>

            <div className="flex justify-between mt-8">
                <button type="button" onClick={onBack} className="px-6 py-2 bg-slate-600/50 border border-slate-500 rounded-lg hover:bg-slate-600/80 transition-colors">Back</button>
                <GlowButton onClick={onNext}>Next: Project Details</GlowButton>
            </div>
        </div>
    );
};


const Step3ProjectDetails: React.FC<any> = ({ track, github, setGithub, synopsis, setSynopsis, ideaTheme, setIdeaTheme, isGenerating, generatedIdeas, handleGenerateIdeas, errors, onBack, onNext, handleBlur, touched }) => {
    const [githubRealName, setGithubRealName] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [githubError, setGithubError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<{ login: string; avatar_url: string; name: string | null }[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const ignoreNextSearch = useRef(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const verifyAbortControllerRef = useRef<AbortController | null>(null);

    const verifyGithubUser = async (username: string) => {
        handleBlur('githubUsername');
        if (!username.trim() || showDropdown) {
            setGithubRealName(null);
            setGithubError(null);
            return;
        }
    
        // Cancel previous verification request if any
        if (verifyAbortControllerRef.current) {
            verifyAbortControllerRef.current.abort();
        }
        
        setIsVerifying(true);
        setGithubError(null);
        setGithubRealName(null);
    
        try {
            const user = await fetchGithubUser(username);
            if (user) {
                setGithubRealName(user.name || user.login);
                setGithubError(null);
            } else {
                setGithubRealName(null);
                setGithubError(`GitHub user "${username}" could not be found.`);
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                setGithubRealName(null);
                setGithubError(error.message || "Failed to connect to GitHub. Please try again later.");
                console.error("GitHub verification failed:", error);
            }
        } finally {
            setIsVerifying(false);
            verifyAbortControllerRef.current = null;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        // Clear timeout on unmount
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (ignoreNextSearch.current) {
            ignoreNextSearch.current = false;
            return;
        }

        if (github.length < 2) {
            setGithubRealName(null);
            setGithubError(null);
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            setIsSearching(true);
            setGithubError(null);
            setGithubRealName(null);
            setShowDropdown(true);

            try {
                const users = await searchGithubUsers(github);
                setSearchResults(users);
            } catch (err: any) {
                setGithubError(err.message || 'Failed to search for users.');
                setShowDropdown(false);
            } finally {
                setIsSearching(false);
            }
        }, 300);

    }, [github]);

    const handleUserSelect = (user: { login: string; name: string | null; avatar_url: string }) => {
        ignoreNextSearch.current = true;
        setGithub(user.login);
        setShowDropdown(false);
        setSearchResults([]);
        // Set user's real name directly from search result, avoiding another API call
        setGithubRealName(user.name || user.login);
        setGithubError(null);
        handleBlur('githubUsername');
    };


    return (
        <div>
            <StepHeader title="Project Details" subtitle="Lay the groundwork for your project. What will you build?" />
            <div className="space-y-4">
                 <div className="bg-slate-900/30 p-3 rounded-lg border border-purple-500/30">
                    <span className="text-sm text-slate-400">Selected Track: </span>
                    <span className="font-semibold text-cyan-400">{track}</span>
                 </div>
                <div className="relative" ref={searchContainerRef}>
                    <ModernFormInput id="github" label="Leader's GitHub Username" value={github} onChange={setGithub} onBlur={() => verifyGithubUser(github)} error={errors.githubUsername || githubError} isSuccess={touched.githubUsername && !errors.githubUsername && !githubError} autoComplete="off" />
                     <AnimatePresence>
                        {showDropdown && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-20 w-full mt-1 bg-slate-900 border border-purple-500/50 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                            >
                                {isSearching && <div className="p-3 text-slate-400">Searching...</div>}
                                {!isSearching && searchResults.length === 0 && <div className="p-3 text-slate-400">No users found.</div>}
                                {!isSearching && searchResults.map((user) => (
                                    <button
                                        type="button"
                                        key={user.login}
                                        onClick={() => handleUserSelect(user)}
                                        className="w-full text-left flex items-center p-3 space-x-3 hover:bg-purple-500/20 transition-colors"
                                    >
                                        <img src={user.avatar_url} alt={user.login} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <span className="font-semibold text-white">{user.login}</span>
                                            {user.name && <span className="text-sm text-slate-400 block">{user.name}</span>}
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {isVerifying && <p className="text-sm text-slate-400 mt-1 animate-pulse">Verifying user...</p>}
                    {githubRealName && !isVerifying && !githubError && (
                      <div className="mt-2 p-2 bg-green-500/10 border border-green-400/50 rounded-lg flex items-center space-x-2 text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-300" />
                        <span className="text-slate-300">User found: <strong className="text-white">{githubRealName}</strong></span>
                      </div>
                    )}
                </div>
                <div>
                     <label htmlFor="synopsis" className="block mb-2 text-sm font-medium text-slate-300">Project Synopsis</label>
                     <textarea id="synopsis" value={synopsis} onChange={e => setSynopsis(e.target.value)} onBlur={() => handleBlur('projectSynopsis')} rows={4} className={`w-full p-3 bg-slate-800 border-2 rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.projectSynopsis ? 'border-rose-500/80 focus:ring-rose-500' : (touched.projectSynopsis ? 'border-green-500/80 focus:ring-green-500' : 'border-purple-500/30 focus:ring-cyan-500')}`} placeholder="Briefly describe your project idea..."></textarea>
                     {errors.projectSynopsis && <p className="text-rose-400 text-sm mt-1">{errors.projectSynopsis}</p>}
                </div>
            </div>
             <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-cyan-500/30">
                <h3 className="font-semibold mb-2 text-cyan-400 flex items-center"><WandSparklesIcon className="w-5 h-5 mr-2" /> AI Idea Generator</h3>
                <div className="flex gap-2">
                    <input type="text" placeholder="Enter a theme..." value={ideaTheme} onChange={(e) => setIdeaTheme(e.target.value)} className="flex-grow p-2 bg-slate-800 border border-purple-500/30 rounded-lg"/>
                    <button type="button" onClick={handleGenerateIdeas} disabled={isGenerating} className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:bg-slate-600">{isGenerating ? '...' : 'Generate'}</button>
                </div>
                {generatedIdeas.length > 0 && <div className="mt-3 space-y-2">{generatedIdeas.map((idea, i) => <div key={i} className="bg-slate-800/70 p-2 rounded-md text-sm">{idea}</div>)}</div>}
            </div>
            <div className="flex justify-between mt-8">
                <button type="button" onClick={onBack} className="px-6 py-2 bg-slate-600/50 border border-slate-500 rounded-lg hover:bg-slate-600/80 transition-colors">Back</button>
                <GlowButton onClick={onNext}>Next: Review & Finalize</GlowButton>
            </div>
        </div>
    );
}

const ReviewSection: React.FC<{ title: string; onEdit: () => void; children: React.ReactNode }> = ({ title, onEdit, children }) => (
    <div className="bg-slate-900/30 p-4 rounded-lg border border-purple-500/30">
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-cyan-400">{title}</h4>
            <button type="button" onClick={onEdit} className="text-sm text-slate-400 hover:text-white flex items-center space-x-1">
                <PencilIcon className="w-4 h-4" />
                <span>Edit</span>
            </button>
        </div>
        <div className="space-y-1 text-sm text-slate-300">{children}</div>
    </div>
);

const Step4ReviewAndFinalize: React.FC<any> = ({ teamData, onEditStep, accommodation, setAccommodation, paymentConfirmed, setPaymentConfirmed, onBack }) => {
    const { teamName, track, collegeName, city, address, leader, members, githubUsername, projectSynopsis } = teamData;
    
    return (
        <div>
            <StepHeader title="Review & Finalize" subtitle="One last look before you're all set. Please confirm your details are correct." />
            
            <div className="space-y-4 mb-8">
                <ReviewSection title="Team Identity" onEdit={() => onEditStep(0)}>
                    <p><strong>Name:</strong> {teamName}</p>
                </ReviewSection>

                <ReviewSection title="Team Info" onEdit={() => onEditStep(1)}>
                    <p><strong>Track:</strong> {track}</p>
                    <p><strong>College:</strong> {collegeName}</p>
                    <p><strong>Location:</strong> {city}{address && `, ${address}`}</p>
                </ReviewSection>

                <ReviewSection title="Member Details" onEdit={() => onEditStep(2)}>
                    <p><strong>Leader:</strong> {leader.name} ({leader.email})</p>
                    {members.length > 0 && <p><strong>Members:</strong> {members.map((m: TeamMember) => m.name).join(', ')}</p>}
                </ReviewSection>

                <ReviewSection title="Project Details" onEdit={() => onEditStep(3)}>
                    <p><strong>GitHub:</strong> {githubUsername}</p>
                    <p><strong>Synopsis:</strong> {projectSynopsis}</p>
                </ReviewSection>
            </div>

            <div className="space-y-6">
                 <div>
                    <h3 className="font-semibold mb-2 text-slate-300">Accommodation</h3>
                     <label htmlFor="accommodation" className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg cursor-pointer">
                        <input type="checkbox" id="accommodation" checked={accommodation} onChange={e => setAccommodation(e.target.checked)} className="h-5 w-5 rounded bg-slate-700 border-purple-500 text-cyan-500 focus:ring-cyan-600" />
                        <span>Do you require accommodation? (For out-of-town participants)</span>
                    </label>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2 text-slate-300">Registration Fee ($10/person)</h3>
                    <div className={`p-4 rounded-lg border ${paymentConfirmed ? 'bg-green-500/10 border-green-400/50' : 'bg-slate-800/50 border-purple-500/30'}`}>
                        {paymentConfirmed ? (
                            <div className="flex items-center space-x-2 text-green-300">
                                <CheckCircleIcon className="w-6 h-6"/>
                                <p className="font-semibold">Payment Confirmed! You're all set.</p>
                            </div>
                        ) : (
                            <button type="button" onClick={() => setPaymentConfirmed(true)} className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform">
                                Proceed to Pay (Mock)
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <button type="button" onClick={onBack} className="px-6 py-2 bg-slate-600/50 border border-slate-500 rounded-lg hover:bg-slate-600/80 transition-colors">Back</button>
                <button type="submit" disabled={!paymentConfirmed} className="px-8 py-3 text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:scale-100">Complete Registration!</button>
            </div>
        </div>
    );
};

const RegistrationFlow: React.FC<RegistrationProps> = ({ onRegistrationComplete }) => {
  const [step, setStep] = useState(0);
  const [teamId, setTeamId] = useState('');

  // Form states
  const [teamName, setTeamName] = useState('');
  const [teamLogoUrl, setTeamLogoUrl] = useState<string | undefined>(undefined);
  const [track, setTrack] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [institutionIdUrl, setInstitutionIdUrl] = useState<string | undefined>(undefined);
  const [leader, setLeader] = useState<TeamMember>({ name: '', email: '', contactNumber: '', tshirtSize: 'L', githubUrl: '' });
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [githubUsername, setGithubUsername] = useState('');
  const [projectSynopsis, setProjectSynopsis] = useState('');
  const [ideaTheme, setIdeaTheme] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [accommodation, setAccommodation] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const addToast = useToast();

  const handleBlur = (field: string) => {
    setTouched(prev => ({...prev, [field]: true}));
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone.replace(/\s/g, ''));
  const validateUrl = (url: string): boolean => {
    if (!url) return true; // It's optional, so an empty string is valid.
    try {
        const parsedUrl = new URL(url);
        // A simple check for github.com. A more robust regex could be used.
        return parsedUrl.hostname.includes('github.com');
    } catch (e) {
        return false;
    }
  };

  const getNestedValue = (obj: any, path: string) => path.split('.').reduce((o, k) => (o || {})[k], obj);

  // Real-time validation for touched fields
  useEffect(() => {
    const newErrors: Record<string, any> = {};
    const isTouched = (path: string) => getNestedValue(touched, path);

    // Step 0
    if (isTouched('teamName') && !teamName.trim()) newErrors.teamName = 'Team name is required.';

    // Step 1
    if (isTouched('track') && !track) newErrors.track = 'Please select a track.';
    if (isTouched('collegeName') && !collegeName.trim()) newErrors.collegeName = 'College name is required.';
    if (isTouched('city') && !city.trim()) newErrors.city = 'City is required.';

    // Step 2
    const step2Errors: Record<string, any> = { leader: {}, members: [] };
    if (isTouched('leader.name') && !leader.name.trim()) step2Errors.leader.name = "Leader's name is required.";
    if (isTouched('leader.email') && !validateEmail(leader.email)) step2Errors.leader.email = 'Please enter a valid email address.';
    if (isTouched('leader.contactNumber') && leader.contactNumber && !validatePhone(leader.contactNumber)) step2Errors.leader.contactNumber = 'Contact number must be 10 digits.';
    if (isTouched('leader.githubUrl') && leader.githubUrl && !validateUrl(leader.githubUrl)) step2Errors.leader.githubUrl = 'Please enter a valid GitHub profile URL.';

    const membersErrorArray: any[] = [];
    members.forEach((member, index) => {
        const memberErrors: any = {};
        if (isTouched(`members.${index}.name`) && !member.name.trim()) memberErrors.name = 'Member name is required.';
        if (isTouched(`members.${index}.email`) && !validateEmail(member.email)) memberErrors.email = 'Please enter a valid email address.';
        if (isTouched(`members.${index}.contactNumber`) && member.contactNumber && !validatePhone(member.contactNumber)) memberErrors.contactNumber = 'Contact number must be 10 digits.';
        if (isTouched(`members.${index}.githubUrl`) && member.githubUrl && !validateUrl(member.githubUrl)) memberErrors.githubUrl = 'Please enter a valid GitHub profile URL.';
        membersErrorArray.push(memberErrors);
    });
    step2Errors.members = membersErrorArray;
    if (Object.keys(step2Errors.leader).length > 0 || step2Errors.members.some((e: any) => Object.keys(e).length > 0)) {
        newErrors.step2 = step2Errors;
    }

    // Step 3
    if (isTouched('githubUsername') && !githubUsername.trim()) newErrors.githubUsername = 'GitHub username is required.';
    if (isTouched('projectSynopsis') && (!projectSynopsis.trim() || projectSynopsis.trim().length < 20)) newErrors.projectSynopsis = 'Please provide a synopsis of at least 20 characters.';

    setErrors(newErrors);
  }, [teamName, track, collegeName, city, leader, members, githubUsername, projectSynopsis, touched]);

  const validateStepOnNext = (currentStep: number): boolean => {
    const newErrors: Record<string, any> = {};
    if (currentStep === 0) {
      if (!teamName.trim()) newErrors.teamName = 'Team name is required.';
    }
    if (currentStep === 1) {
        if (!track) newErrors.track = 'Please select a track.';
        if (!collegeName.trim()) newErrors.collegeName = 'College name is required.';
        if (!city.trim()) newErrors.city = 'City is required.';
    }
    if (currentStep === 2) {
      let isStepValid = true;
      const step2Errors: Record<string, any> = { leader: {}, members: [] };

      if (!leader.name.trim()) { step2Errors.leader.name = "Leader's name is required."; isStepValid = false; }
      if (!validateEmail(leader.email)) { step2Errors.leader.email = 'Please enter a valid email address.'; isStepValid = false; }
      
      const membersErrorArray: any[] = [];
      members.forEach((member) => {
        const currentMemberErrors: any = {};
        const isPartiallyFilled = member.name.trim() || member.email.trim() || member.contactNumber.trim() || (member.githubUrl || '').trim();
        if (isPartiallyFilled) {
          if (!member.name.trim()) { currentMemberErrors.name = 'Member name is required.'; isStepValid = false; }
          if (!validateEmail(member.email)) { currentMemberErrors.email = 'Please enter a valid email address.'; isStepValid = false; }
        }
        membersErrorArray.push(currentMemberErrors);
      });
      step2Errors.members = membersErrorArray;
      if (!isStepValid) newErrors.step2 = step2Errors;
    }
    if (currentStep === 3) {
      if (!githubUsername.trim()) newErrors.githubUsername = 'GitHub username is required.';
      if (!projectSynopsis.trim() || projectSynopsis.trim().length < 20) newErrors.projectSynopsis = 'Please provide a synopsis of at least 20 characters.';
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    const fieldsToTouch: Record<string, boolean> = {};
    if(step === 0) fieldsToTouch.teamName = true;
    if(step === 1) { fieldsToTouch.track = true; fieldsToTouch.collegeName = true; fieldsToTouch.city = true; }
    if(step === 2) {
        Object.keys(leader).forEach(key => fieldsToTouch[`leader.${key}`] = true);
        members.forEach((m, i) => {
          const isPartiallyFilled = m.name.trim() || m.email.trim() || m.contactNumber.trim() || (m.githubUrl || '').trim();
          if (isPartiallyFilled) {
            Object.keys(m).forEach(key => fieldsToTouch[`members.${i}.${key}`] = true);
          }
        });
    }
    if(step === 3) { fieldsToTouch.githubUsername = true; fieldsToTouch.projectSynopsis = true; }
    setTouched(prev => ({...prev, ...fieldsToTouch}));

    if (validateStepOnNext(step)) {
      if (step === 0 && !teamId) setTeamId(`T${Date.now()}`);
      if (step < 4) setStep(s => s + 1);
    }
  };
  const handlePrevStep = () => setStep(s => s - 1);

  const handleAddMember = () => {
    if (members.length < 4) setMembers([...members, { name: '', email: '', contactNumber: '', tshirtSize: 'L', githubUrl: '' }]);
  };

  const handleRemoveMember = (indexToRemove: number) => {
    setMembers(members.filter((_, index) => index !== indexToRemove));
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string | undefined) => {
    const newMembers = [...members];
    const memberToUpdate = { ...newMembers[index], [field]: value };
    newMembers[index] = memberToUpdate;
    setMembers(newMembers);
  };
  
  const handleGenerateIdeas = async () => {
      if (!ideaTheme) { addToast("Please enter a theme or topic first.", "info"); return; }
      setIsGenerating(true); setGeneratedIdeas([]);
      const ideas = await generateProjectIdeas(ideaTheme);
      setGeneratedIdeas(ideas); setIsGenerating(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStepOnNext(0) && validateStepOnNext(1) && validateStepOnNext(2) && validateStepOnNext(3)) {
      if (!paymentConfirmed) {
        addToast("Please confirm the payment to proceed.", "info");
        return;
      }
      
      const newPassword = `${teamName.substring(0, 3).replace(/\s/g, '')}${Math.random().toString(36).slice(-5)}`.toUpperCase();
      const submissionTicket = `SUBMIT-${teamId}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      
      const newTeam: Team = {
        id: teamId, name: teamName, leader, members: members.filter(m => m.name.trim() && m.email.trim()),
        githubRepo: `https://github.com/${githubUsername}/${teamName.toLowerCase().replace(/\s/g, '-')}`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${teamId}_${teamName.replace(/\s/g, '')}`,
        registeredAt: new Date().toISOString(),
        track, collegeName, city, address, institutionIdUrl,
        projectSynopsis, accommodation, password: newPassword, paymentStatus: 'Paid',
        teamLogoUrl,
        status: 'Registered',
        isVerified: false,
        submissionTicket,
      };
      
      onRegistrationComplete(newTeam);
    } else {
      addToast("Please fix the errors before submitting.", "error");
    }
  };

    const renderStepContent = () => {
      const teamData = { teamName, teamLogoUrl, track, collegeName, city, address, institutionIdUrl, leader, members: members.filter(m => m.name.trim()), githubUsername, projectSynopsis, accommodation };
      
      const touchedStep2: any = { leader: {}, members: [] };
      Object.keys(touched).forEach(key => {
        if(key.startsWith('leader.')) touchedStep2.leader[key.replace('leader.', '')] = true;
        if(key.startsWith('members.')) {
            const parts = key.split('.');
            const index = parseInt(parts[1], 10);
            if(!touchedStep2.members[index]) touchedStep2.members[index] = {};
            touchedStep2.members[index][parts[2]] = true;
        }
      });

      switch (step) {
          case 0: return <Step0TeamIdentity teamName={teamName} setTeamName={setTeamName} teamLogoUrl={teamLogoUrl} setTeamLogoUrl={setTeamLogoUrl} errors={errors} onNext={handleNextStep} handleBlur={handleBlur} touched={touched} />;
          case 1: return <Step1TeamInfo track={track} setTrack={setTrack} collegeName={collegeName} setCollegeName={setCollegeName} city={city} setCity={setCity} address={address} setAddress={setAddress} institutionIdUrl={institutionIdUrl} setInstitutionIdUrl={setInstitutionIdUrl} errors={errors} onBack={handlePrevStep} onNext={handleNextStep} handleBlur={handleBlur} touched={touched} />;
          case 2: return <Step2MemberDetails leader={leader} setLeader={setLeader} members={members} handleMemberChange={handleMemberChange} handleAddMember={handleAddMember} handleRemoveMember={handleRemoveMember} errors={errors.step2 || {}} onBack={handlePrevStep} onNext={handleNextStep} handleBlur={handleBlur} touched={touchedStep2}/>;
          case 3: return <Step3ProjectDetails track={track} github={githubUsername} setGithub={setGithubUsername} synopsis={projectSynopsis} setSynopsis={setProjectSynopsis} ideaTheme={ideaTheme} setIdeaTheme={setIdeaTheme} isGenerating={isGenerating} generatedIdeas={generatedIdeas} handleGenerateIdeas={handleGenerateIdeas} errors={errors} onBack={handlePrevStep} onNext={handleNextStep} handleBlur={handleBlur} touched={touched} />;
          case 4: return <Step4ReviewAndFinalize teamData={teamData} onEditStep={setStep} accommodation={accommodation} setAccommodation={setAccommodation} paymentConfirmed={paymentConfirmed} setPaymentConfirmed={setPaymentConfirmed} onBack={handlePrevStep} />;
          default: return null;
      }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <AnimatePresence mode="wait">
        <motion.h1 
            key={`header-${step}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-4xl font-bold text-center mb-8 font-orbitron text-white"
        >
          {step <= 3 ? "Hackathon Registration" : "Final Step: Review & Pay"}
        </motion.h1>
      </AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1 hidden md:block"><div className="sticky top-32"><VerticalStepper currentStep={step} /></div></div>
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-[#100D1C]/50 border border-purple-800/60 p-8 rounded-xl backdrop-blur-sm shadow-2xl shadow-purple-900/10 min-h-[30rem]">
                <AnimatePresence>
                    {teamId && step > 0 && step < 5 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-cyan-500/30 text-center flex items-center justify-center gap-4"
                        >
                            {teamLogoUrl && <img src={teamLogoUrl} alt="Team Logo" className="w-10 h-10 rounded-full object-cover" />}
                            <div>
                                <h3 className="text-xl font-bold text-white">{teamName}</h3>
                                <p className="text-sm text-slate-400">
                                    Team ID: <span className="font-mono bg-slate-800 px-2 py-1 rounded">{teamId}</span>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {step < 5 && <ProgressBar currentStep={step} totalSteps={5} />}

                <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>
            </form>
          </div>
      </div>
    </div>
  );
};


const UserPortal: React.FC<RegistrationProps> = ({ onRegistrationComplete }) => {
    return (
        <RegistrationFlow onRegistrationComplete={onRegistrationComplete} />
    );
};

export default UserPortal;