import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import { useGetSlotActivation, useUpdateSlotActivation } from '../hooks/useSlotActivation';
import { useWalletBalance } from '../hooks/useWallet';
import PageHeading from './PageHeading';

const LEVEL_THRESHOLDS = {
    2: 40,
    3: 80,
    4: 160,
    5: 320,
    6: 640,
    7: 1280
};

const LEVELS = [
    {
        id: 1,
        title: "LEVEL 01",
        igtBalance: "1,450",
        cesValue: "420",
        icon: "rocket_launch",
        glowColor: "glow-purple",
        planetColor: "glow-gold"
    },
    {
        id: 2,
        title: "LEVEL 02",
        igtBalance: "2,800",
        cesValue: "850",
        icon: "public",
        glowColor: "glow-blue",
        planetColor: "bg-blue-400"
    },
    {
        id: 3,
        title: "LEVEL 03",
        igtBalance: "5,000",
        cesValue: "1,200",
        icon: "hub",
        glowColor: "glow-amber",
        planetColor: "bg-amber-400"
    },
    {
        id: 4,
        title: "LEVEL 04",
        igtBalance: "12,500",
        cesValue: "3,400",
        icon: "visibility",
        glowColor: "glow-red",
        planetColor: "bg-red-400"
    },
    {
        id: 5,
        title: "LEVEL 05",
        igtBalance: "25,000",
        cesValue: "7,200",
        icon: "auto_awesome_motion",
        glowColor: "glow-indigo",
        planetColor: "bg-indigo-400"
    },
    {
        id: 6,
        title: "LEVEL 06",
        igtBalance: "50,000",
        cesValue: "15,000",
        icon: "auto_awesome",
        glowColor: "glow-gold",
        planetColor: "bg-white"
    },
    {
        id: 7,
        title: "LEVEL 07",
        igtBalance: "100,000",
        cesValue: "32,000",
        icon: "diamond",
        glowColor: "glow-cyan",
        planetColor: "bg-cyan-400"
    }
];

const NeuralGrid = ({ isActive }) => (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${isActive ? 'opacity-20' : 'opacity-5'}`}>
        <svg width="100%" height="100%" className="absolute inset-0">
            <pattern id="neuralPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent-gold" />
                <circle cx="0" cy="0" r="1.5" fill="currentColor" className="text-accent-gold" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#neuralPattern)" />
        </svg>
    </div>
);

const MatrixOrbital = ({ level, isActive, percentage = 85 }) => {
    return (
        <div className={`relative w-full h-36 flex items-center justify-center overflow-visible`}>
            {/* SVG Orbital System - Aligned with Project Theme */}
            <svg viewBox="0 0 200 200" className="h-full w-auto relative z-10 overflow-visible">
                <defs>
                    <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FF8C00" />
                        <stop offset="70%" stopColor="#FF2D00" />
                        <stop offset="100%" stopColor="#4A0E00" />
                    </radialGradient>
                    <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Orbit Circles - Using Warm Glow with Better Visibility */}
                <circle cx="100" cy="100" r="45" fill="none" stroke="#FF8C00" strokeWidth="1.5" opacity="0.35" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#FF8C00" strokeWidth="1.5" opacity="0.35" />

                {/* Central Core */}
                <circle cx="100" cy="100" r="24" fill="url(#coreGradient)" className="animate-pulse" />
                <text
                    x="100" y="103"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    className="text-[20px] font-display font-black select-none"
                >U</text>

                {/* Inner Ring Nodes (Clustered Bottom) */}
                <circle cx="68" cy="132" r="6" fill="#00ff88" filter="url(#nodeGlow)" />
                <circle cx="100" cy="145" r="6" fill="#FFC800" filter="url(#nodeGlow)" />
                <circle cx="132" cy="132" r="6" fill="#FFC800" filter="url(#nodeGlow)" />

                {/* Outer Ring Nodes (Top and RCYL) */}
                <circle cx="100" cy="30" r="6" fill="#ffffff" filter="url(#nodeGlow)" />

                <circle cx="150" cy="50" r="4" fill="#ffffff" opacity="0.9" />
                <text x="160" y="54" fill="#ffffff" className="text-[10px] font-display font-bold opacity-80 uppercase tracking-tighter">RCYL</text>
            </svg>
        </div>
    );
};

const SlotLevelCard = ({ level, status, cost, energy, isActive, onActivate, earnings, isPending, activatingLevel }) => {
    const isAvailable = status === 'available';
    const isLocked = status === 'locked';
    const isActivatingThis = activatingLevel === level;

    return (
        <div className="h-full relative group transition-all duration-500">
            {/* Card Background - Project Black Soft */}
            <div className={`
                h-full relative bg-black-soft rounded-3xl overflow-hidden border 
                ${isActive ? 'border-accent-gold shadow-[0_0_30px_rgba(212,175,55,0.15)]' : 'border-white/5'}
                px-4 py-3 flex flex-col items-center
                ${isLocked ? 'opacity-60 grayscale' : 'opacity-100'}
            `}>

                {/* Top Headers */}
                <div className="w-full flex justify-between items-center mb-2 px-1">
                    <div className="bg-black-elevated px-3 py-1 rounded-md border border-white/10">
                        <span className="text-white text-[12px] font-display font-bold">{cost}$</span>
                    </div>
                    {isActive && (
                        <div className="bg-green-dark/20 px-3 py-1 rounded-md border border-green-accent/40">
                            <span className="text-green-accent text-[8px] font-display font-bold tracking-wider">ACTIVATED</span>
                        </div>
                    )}
                    {isAvailable && (
                        <div className="bg-accent-gold/20 px-3 py-1 rounded-md border border-accent-gold/40">
                            <span className="text-accent-gold text-[8px] font-display font-bold tracking-wider">READY</span>
                        </div>
                    )}
                </div>

                {/* Orbital Visualization */}
                <MatrixOrbital level={level} isActive={isActive} />

                {/* Level Title */}
                <h3 className="text-white text-xl font-display font-extrabold tracking-widest mt-2 uppercase">
                    LEVEL {level < 10 ? `0${level}` : level}
                </h3>

                {/* Stats Grid - Fixed Layout for Consistency */}
                <div className="w-full mt-4 grid grid-cols-3 gap-0 border border-white/5 rounded-xl overflow-hidden mb-3">
                    <div className="bg-black-elevated p-2 border-r border-white/5 flex flex-col items-start justify-center">
                        <span className="text-[8px] text-zinc-500 font-bold leading-tight">INCOME</span>
                        <span className="text-white text-[12px] font-display font-bold">{earnings?.level || '100'}</span>
                    </div>
                    <div className="bg-black-elevated p-2 border-r border-white/5 flex flex-col items-start justify-center">
                        <span className="text-[8px] text-zinc-500 font-bold leading-tight">REF</span>
                        <span className="text-white text-[12px] font-display font-bold">{earnings?.referral || '200'}</span>
                    </div>
                    <div className="bg-black-elevated p-2 flex flex-col items-start justify-center">
                        <span className="text-[8px] text-zinc-500 font-bold leading-tight">CYCLE</span>
                        <span className="text-white text-[12px] font-display font-bold">{earnings?.recycle || '40'}</span>
                    </div>
                    <div className={`col-span-3 bg-black-elevated p-2 border-t border-white/5 flex flex-col items-start justify-center transition-opacity ${level < 6 ? 'opacity-30' : 'opacity-100'}`}>
                        <span className="text-[8px] text-zinc-500 font-bold leading-tight">MATRIX</span>
                        <span className="text-white text-[12px] font-display font-bold">{level < 6 ? '---' : (earnings?.matrix || '20')}</span>
                    </div>
                </div>

                {/* Action Button */}
                {!isActive ? (
                    <button
                        disabled={isLocked || isPending}
                        onClick={() => onActivate?.(level)}
                        className={`
                            w-full py-3 rounded-xl font-display font-black text-[11px] tracking-[0.2em] uppercase transition-all duration-300
                            ${(isLocked || isPending)
                                ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed border border-white/5'
                                : 'gold-gradient-bg text-black shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98]'
                            }
                            ${isActivatingThis ? 'animate-pulse' : ''}
                        `}
                    >
                        {isLocked ? 'LOCKED' : (isActivatingThis ? 'PROCESSING...' : 'ACTIVATE')}
                    </button>
                ) : (
                    <div className="w-full py-3 rounded-xl bg-accent-gold/10 border border-accent-gold/20 text-accent-gold font-display font-black text-[11px] tracking-[0.2em] uppercase text-center">
                        ACTIVATED
                    </div>
                )}
            </div>
        </div>
    );
};

const SlotActivation = () => {
    let userId = null;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
            userId = JSON.parse(storedUser)?.id;
        }
    } catch (e) {
        console.error('Error parsing user from localStorage', e);
    }

    const [isTestMode, setIsTestMode] = useState(false);
    const [testActiveLevel, setTestActiveLevel] = useState(1);
    const [testIsPending, setTestIsPending] = useState(false);

    const { data: slotActivation, isLoading, error } = useGetSlotActivation(userId || '');
    const { mutate: updateSlotActivation, isPending: realIsPending, variables } = useUpdateSlotActivation(userId || '');

    const getRawLevel = () => {
        if (!slotActivation) return 1;
        // Handle both flattened and nested data structures
        const level = slotActivation?.data?.current_level_id ?? slotActivation?.current_level_id;
        return level !== undefined ? level : 1;
    };

    const currentActiveLevel = isTestMode ? testActiveLevel : getRawLevel();
    const isPending = isTestMode ? testIsPending : realIsPending;
    const activatingLevel = isPending ? (isTestMode ? testActiveLevel + 1 : variables?.current_level_id) : null;

    // Diagnostic logging
    React.useEffect(() => {
        if (slotActivation) {
            console.log('[SlotActivation] API Data Received:', slotActivation);
            console.log('[SlotActivation] Resolved Active Level:', currentActiveLevel);
        }
    }, [slotActivation, currentActiveLevel, isTestMode]);

    const { address, isConnected } = useAccount();
    const { data: walletData } = useWalletBalance();

    const handleActivate = (level) => {
        console.log(`[SlotActivation] Triggering activation for Level ${level}`);
        const threshold = LEVEL_THRESHOLDS[level];
        if (threshold) {
            const currentBalance = parseFloat(walletData?.ethBalance || '0');
            console.log(`[SlotActivation] Balance check: Required $${threshold}, Current $${currentBalance}`);
            if (currentBalance < threshold) {
                console.warn(`[SlotActivation] Insufficient balance for Level ${level}`);
                toast.error(`Insufficient Balance! You need at least $${threshold} to activate LEVEL 0${level}.`, {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "dark",
                });
                return;
            }
        }
        console.log(`[SlotActivation] Proceeding with mutation for Level ${level}`);
        if (isTestMode) {
            console.log(`[TEST MODE] Activating Level ${level}`);
            setTestIsPending(true);
            setTimeout(() => {
                setTestActiveLevel(level);
                setTestIsPending(false);
                toast.success(`[TEST] Level ${level} Activated!`);
            }, 2000);
            return;
        }
        updateSlotActivation({ current_level_id: level });
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-gold"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-accent-gold rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px] text-white">
                <div className="text-center p-10 bg-black-soft rounded-[40px] border border-red-500/20 backdrop-blur-3xl shadow-2xl">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4 animate-bounce">report</span>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">System Link Failure</h3>
                    <p className="text-zinc-500 text-sm mt-3 font-medium">{error.message}</p>
                </div>
            </div>
        );
    }



    const levels = [
        { level: 1, cost: "20", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 2, cost: "40", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 3, cost: "80", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 4, cost: "160", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 5, cost: "320", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 6, cost: "640", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 7, cost: "1280", earnings: { level: "200", referral: "400", recycle: "80" } },
    ];

    return (
        <div className="min-h-screen bg-background-dark py-12 px-4 md:px-8 relative overflow-hidden">
            {/* Page Header */}
            <div className="flex justify-between items-end mb-16 max-w-7xl mx-auto px-4 w-full">
                <PageHeading
                    badge="SECURED MATRIX PROTOCOL"
                    highlight="MATRIX"
                    title="ACTIVATION"
                />

                {/* Stats Summary */}
                <div className="hidden lg:flex items-center gap-8 bg-black-soft/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 mb-12">
                    <div className="text-center">
                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Active Nodes</span>
                        <span className="text-2xl font-display font-black text-white">{currentActiveLevel}<span className="text-zinc-500">/7</span></span>
                    </div>
                </div>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 items-stretch">
                {levels.map((lvl, index) => {
                    let status = 'locked';
                    if (lvl.level <= currentActiveLevel) status = 'active';
                    else if (lvl.level === currentActiveLevel + 1) status = 'available';

                    return (
                        <motion.div
                            key={lvl.level}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <SlotLevelCard
                                {...lvl}
                                status={status}
                                isActive={lvl.level <= currentActiveLevel}
                                onActivate={(l) => handleActivate(l)}
                                isPending={isPending}
                                activatingLevel={activatingLevel}
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom Footer Info */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="mt-20 p-8 md:p-12 bg-black-soft/30 backdrop-blur-3xl rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-gold/5 blur-[120px] -z-10 group-hover:bg-accent-gold/10 transition-all duration-1000 animate-pulse"></div>
                <div className="max-w-xl text-center md:text-left space-y-2">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-ping"></div>
                        <h4 className="text-lg md:text-xl font-black italic uppercase tracking-tighter">Dominance Protocol v2.4</h4>
                    </div>
                    <p className="text-zinc-500 text-[11px] md:text-xs font-semibold leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                        "Secure your position in the matrix. Every node activation exponentially increases your weight across the decentralized distribution network. Synchronize now to maximize yields."
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        SPECS
                    </button>
                    <button className="px-10 py-3 bg-accent-gold text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:scale-110 active:scale-95 transition-all">
                        SYNC
                    </button>
                </div>
            </motion.div>
            {/* Testing Dashboard Override */}
            {isTestMode && (
                <div className="fixed bottom-8 right-8 z-100 bg-black-soft border border-accent-gold/50 p-6 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)] backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-accent-gold rounded-full animate-pulse"></div>
                        <span className="text-accent-gold font-display text-[10px] font-bold tracking-widest uppercase italic">Testing Interface</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] text-zinc-500 font-bold uppercase">Active Level</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setTestActiveLevel(Math.max(0, testActiveLevel - 1))}
                                    className="w-8 h-8 rounded-lg bg-black-elevated border border-white/10 flex items-center justify-center text-white hover:bg-white/5"
                                >-</button>
                                <span className="text-white font-display font-bold text-lg min-w-8 text-center">{testActiveLevel}</span>
                                <button
                                    onClick={() => setTestActiveLevel(Math.min(12, testActiveLevel + 1))}
                                    className="w-8 h-8 rounded-lg bg-black-elevated border border-white/10 flex items-center justify-center text-white hover:bg-white/5"
                                >+</button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-8 pt-2 border-t border-white/5">
                            <span className="text-[8px] text-zinc-500 font-bold uppercase">Mock Pending</span>
                            <button
                                onClick={() => setTestIsPending(!testIsPending)}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-colors ${testIsPending ? 'bg-accent-gold text-black' : 'bg-black-elevated text-zinc-400 border border-white/10'}`}
                            >
                                {testIsPending ? 'PENDING ON' : 'OFF'}
                            </button>
                        </div>

                        <button
                            onClick={() => { setIsTestMode(false); setTestActiveLevel(slotActivation?.current_level_id || 1); }}
                            className="w-full mt-2 py-2 rounded-xl border border-red-500/30 text-red-500 text-[9px] font-bold hover:bg-red-500/10 transition-colors uppercase tracking-widest"
                        >
                            Exit Test Mode
                        </button>
                    </div>
                </div>
            )}

            {!isTestMode && (
                <button
                    onClick={() => { setIsTestMode(true); setTestActiveLevel(currentActiveLevel); }}
                    className="fixed bottom-8 right-8 z-90 w-12 h-12 rounded-full bg-black-soft border border-white/10 flex items-center justify-center text-zinc-500 hover:text-accent-gold hover:border-accent-gold/50 transition-all shadow-xl"
                    title="Open Test Mode"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                </button>
            )}
        </div>
    );
};

export default SlotActivation;
