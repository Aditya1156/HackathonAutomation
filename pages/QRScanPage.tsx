import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeamById, updateTeamStatus } from '../services/firebaseTeamService';
import type { Team } from '../types';
import { QrcodeIcon, CheckCircleIcon, XCircleIcon } from '../components/IconComponents';

const QRScanPage: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [teamInfo, setTeamInfo] = useState<Team | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<string>('Scanner is idle.');
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const animationFrameId = useRef<number | undefined>(undefined);

    const startScan = async () => {
        setFeedbackMessage('Searching for QR code...');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
                videoRef.current.play();
                tick();
            }
        } catch (err) {
            console.error("Camera access error:", err);
            setFeedbackMessage('Camera access denied. Please enable camera permissions.');
            setIsScanning(false); // Stop if permissions are denied
        }
    };

    const stopScan = () => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        if (videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const tick = () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            if (canvas && video) {
                const ctx = canvas.getContext('2d');
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
                if (imageData && jsQR) {
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: 'dontInvert',
                    });
                    if (code) {
                        setScanResult(code.data);
                        setIsScanning(false);
                        return; // Stop the loop
                    }
                }
            }
        }
        if (isScanning) {
            animationFrameId.current = requestAnimationFrame(tick);
        }
    };
    
    useEffect(() => {
        if(isScanning) {
            startScan();
        } else {
            stopScan();
        }
        return stopScan;
    }, [isScanning]);
    
    useEffect(() => {
        const fetchTeamData = async () => {
            if (scanResult) {
                try {
                    // Format: T12345_CodeWizards
                    const teamId = scanResult.split('_')[0];
                    const foundTeam = await getTeamById(teamId);
                    if (foundTeam) {
                        setTeamInfo(foundTeam);
                        setFeedbackMessage('Team Found!');
                    } else {
                        setTeamInfo(null);
                        setFeedbackMessage('Invalid QR Code: Team not found.');
                    }
                } catch (error) {
                    console.error('Error fetching team:', error);
                    setTeamInfo(null);
                    setFeedbackMessage('Error loading team data.');
                }
            }
        };
        fetchTeamData();
    }, [scanResult]);

    const handleMarkAttendance = async () => {
        if (!teamInfo) return;
        
        try {
            setFeedbackMessage('Marking attendance...');
            await updateTeamStatus(teamInfo.id, 'Checked-in');
            setFeedbackMessage(`✅ Attendance marked for ${teamInfo.name}!`);
            
            // Update local state
            setTeamInfo({ ...teamInfo, status: 'Checked-in' });
        } catch (error) {
            console.error('Error marking attendance:', error);
            setFeedbackMessage('❌ Failed to mark attendance. Please try again.');
        }
    };

    const handleStartScan = () => {
        setScanResult(null);
        setTeamInfo(null);
        setIsScanning(true);
    };
    
    const handleCancelScan = () => {
        setIsScanning(false);
        setFeedbackMessage('Scanner stopped.');
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">QR Code Scanner</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Scanner View */}
                <div className="relative w-full aspect-square bg-slate-900/50 rounded-xl overflow-hidden border-2 border-purple-800/60 flex items-center justify-center">
                    <video ref={videoRef} className={`w-full h-full object-cover transition-opacity ${isScanning ? 'opacity-100' : 'opacity-0'}`} />
                    <canvas ref={canvasRef} className="hidden" />
                    <AnimatePresence>
                    {isScanning ? (
                        <motion.div 
                           key="scanner-active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                        >
                            <div className="w-3/4 h-3/4 border-4 border-dashed border-cyan-400/50 rounded-lg animate-pulse"></div>
                            <p className="mt-4 text-white bg-black/50 px-3 py-1 rounded-md">{feedbackMessage}</p>
                        </motion.div>
                    ) : (
                        <motion.div 
                           key="scanner-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
                        >
                           <QrcodeIcon className="w-16 h-16 text-slate-600 mb-4" />
                           <h3 className="text-xl font-bold text-white">Scanner is Off</h3>
                           <p className="text-slate-400">Click "Start Scanner" to activate the camera.</p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>

                {/* Scan Result */}
                <div className="bg-[#100D1C]/50 border border-purple-800/60 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 flex items-center">
                            <QrcodeIcon className="w-6 h-6 mr-2 text-cyan-400" />
                            Scan Status
                        </h2>
                        <AnimatePresence mode="wait">
                            {teamInfo ? (
                                <motion.div key="team-found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                    <div className="bg-green-500/10 p-4 rounded-lg border border-green-400/50">
                                        <p className="text-lg font-semibold text-green-300 flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2"/> {feedbackMessage}</p>
                                        <p className="mt-2 text-2xl font-bold text-white">{teamInfo.name}</p>
                                        <p className="text-slate-400">Leader: {teamInfo.leader.name}</p>
                                        <p className="text-slate-400">Members: {teamInfo.members.length + 1}</p>
                                    </div>
                                </motion.div>
                            ) : scanResult ? (
                                <motion.div key="team-not-found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                    <div className="bg-rose-500/10 p-4 rounded-lg border border-rose-400/50">
                                        <p className="text-lg font-semibold text-rose-300 flex items-center"><XCircleIcon className="w-5 h-5 mr-2"/> {feedbackMessage}</p>
                                        <p className="mt-2 text-sm text-slate-400 font-mono break-all">{scanResult}</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="waiting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                    <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                                        <p className="text-slate-400">{feedbackMessage}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="mt-6">
                        {teamInfo ? (
                            <div className="flex gap-4">
                                <button onClick={handleMarkAttendance} className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform">
                                    Mark Attendance
                                </button>
                                <button onClick={handleStartScan} className="w-full px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors">
                                    Scan Next
                                </button>
                            </div>
                        ) : scanResult ? (
                            <button onClick={handleStartScan} className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform">
                                Try Again
                            </button>
                        ) : isScanning ? (
                            <button onClick={handleCancelScan} className="w-full px-6 py-3 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors shadow-md">
                                Stop Camera
                            </button>
                        ) : (
                            <button onClick={handleStartScan} className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform">
                                Start Scanner
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRScanPage;