import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { toast } from 'react-toastify';
import { useGetSlotActivation, useUpdateSlotActivation, useGetAdminWallet } from '../hooks/useSlotActivation';
import { useWalletBalance } from '../hooks/useWallet';
import PageHeading from './PageHeading';

const USDT_ABI = [
    {
        name: 'transfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
];

const USDT_ADDRESS = '0xAB32EAed1B1c2afa890a354B6D7D8BA730AcA434';

const LEVEL_THRESHOLDS = {
    1: 20,
    2: 40,
    3: 80,
    4: 160,
    5: 320,
    6: 640,
    7: 1280
};
const MatrixOrbital = ({ level, isActive }) => {
    return (
        <div className="relative w-full h-44 flex items-center justify-center overflow-visible my-0.5">
            <svg viewBox="0 0 200 200" className="h-[110%] w-auto relative z-10 overflow-visible">
                <defs>
                    <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FF8C00" />
                        <stop offset="70%" stopColor="#FF4500" />
                        <stop offset="100%" stopColor="#4A0E00" />
                    </radialGradient>
                    <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Larger Orbit Circles */}
                <circle cx="100" cy="100" r="55" fill="none" stroke="#633b24" strokeWidth="1" opacity="0.6" />
                <circle cx="100" cy="100" r="85" fill="none" stroke="#633b24" strokeWidth="1" opacity="0.4" />

                {/* Central Core */}
                <circle cx="100" cy="100" r="28" fill="url(#coreGradient)" />
                <text
                    x="100" y="104"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    className="text-[28px] font-display font-black"
                >U</text>

                {/* Nodes - Adjusted for larger orbits */}
                {/* Green node on first orbit (r=55) */}
                <circle cx="61" cy="139" r="7" fill="#00ff88" filter="url(#nodeGlow)" />
                {/* Yellow nodes on first orbit (r=55) */}
                <circle cx="139" cy="139" r="6" fill="#FFC800" filter="url(#nodeGlow)" />

                {/* Nodes on second orbit (r=85) */}
                <circle cx="100" cy="15" r="6" fill="#FFC800" filter="url(#nodeGlow)" />
                <circle cx="100" cy="45" r="5" fill="#ffffff" filter="url(#nodeGlow)" />
            </svg>
        </div>
    );
};

const SlotLevelCard = ({ level, cost, earnings, isActive, status, onActivate, isPending, activatingLevel }) => {
    const isActivatingThis = activatingLevel === level;
    const isLocked = status === 'locked';
    const isPremium = level === 7;

    return (
        <div className={`relative group transition-all duration-500 rounded-3xl overflow-hidden ${isActive ? 'shadow-[0_15px_40px_rgba(0,0,0,0.8)]' : 'shadow-xl'}`}>
            {/* Dark Card Body */}
            <div className={`
                relative bg-linear-to-b from-[#2a1a15] to-[#0c0c0c]
                border border-[#3d2b24] p-3 flex flex-col items-center
                ${isLocked ? 'opacity-70 grayscale' : 'opacity-100'}
            `}>
                {/* Top Bar */}
                <div className="w-full flex justify-between items-center mb-0.5">
                    <div className="bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                        <span className="text-white text-xs font-bold">{cost}$</span>
                    </div>

                    {isPremium && (
                        <div className="bg-linear-to-r from-[#d4af37] to-[#8a6d3b] px-1.5 py-0.5 rounded-lg border border-white/20">
                            <span className="text-black text-[9px] font-black uppercase tracking-wider">PREMIUM</span>
                        </div>
                    )}

                    <div className="flex items-center gap-1.5">
                        {isActive && (
                            <div className="bg-green-500 px-2 py-0.5 rounded-md">
                                <span className="text-black text-[9px] font-black uppercase tracking-widest">ACTIVE</span>
                            </div>
                        )}
                    </div>
                </div>

                <MatrixOrbital level={level} isActive={isActive} />

                <h3 className="text-white text-xl font-display font-black tracking-[0.15em] mb-3 uppercase">
                    LEVEL {level < 10 ? `0${level}` : level}
                </h3>

                {/* Info Grid - More compact */}
                <div className="w-full grid grid-cols-3 gap-1.5 mb-3">
                    <div className="border border-white/10 p-1.5 rounded-lg flex flex-col items-start bg-black/20">
                        <span className="text-[7px] text-[#8a6d3b] font-black uppercase mb-0.5">LEVEL</span>
                        <span className="text-white text-[10px] font-bold">{earnings?.level || '100'}</span>
                    </div>
                    <div className="border border-white/10 p-1.5 rounded-lg flex flex-col items-start bg-black/20">
                        <span className="text-[7px] text-[#8a6d3b] font-black uppercase mb-0.5">REFERRAL</span>
                        <span className="text-white text-[10px] font-bold">{earnings?.referral || '200'}</span>
                    </div>
                    <div className="border border-white/10 p-1.5 rounded-lg flex flex-col items-start bg-black/20">
                        <span className="text-[7px] text-[#8a6d3b] font-black uppercase mb-0.5">RECYCLE</span>
                        <span className="text-white text-[10px] font-bold">{earnings?.recycle || '40'}</span>
                    </div>
                </div>

                {/* Button */}
                {!isActive ? (
                    <button
                        onClick={() => onActivate(level)}
                        disabled={isLocked || isPending}
                        className={`
                        w-full py-3 rounded-lg font-display font-black text-xs uppercase transition-all duration-300
                        ${(isLocked || isPending)
                                ? 'bg-[#1a1a1a] text-[#444] cursor-not-allowed border border-white/5'
                                : 'bg-linear-to-r from-[#d4af37] via-[#f7d581] to-[#8a6d3b] text-black shadow-[0_8px_20px_rgba(212,175,55,0.2)] hover:scale-[1.01]'
                            }
                    `}
                    >
                        {isLocked ? 'LOCKED' : (isActivatingThis ? 'ACTIVATING...' : 'ACTIVATE NOW')}
                    </button>
                ) : (
                    <div className="w-full py-3 rounded-lg bg-[#142319] border border-green-500/30 text-green-500 font-display font-black text-xs uppercase text-center shadow-inner">
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
    } catch (e) { }

    const { data: slotActivation, isLoading, error } = useGetSlotActivation(userId || '');
    const { mutate: updateSlotActivation, isPending: isUpdatingBackend, variables } = useUpdateSlotActivation(userId || '');
    const { data: walletData, refetch: refetchBalance } = useWalletBalance();
    const { data: adminWalletResponse } = useGetAdminWallet();
    const dynamicTreasuryAddress = adminWalletResponse?.data?.address;

    // Blockchain Transaction Hooks
    const { writeContract, data: hash, error: txError, isPending: isTxPending } = useWriteContract();
    const { isLoading: isWaitingForTx, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash });

    const currentActiveLevel = slotActivation?.data?.current_level_id ?? slotActivation?.current_level_id ?? 1;
    const [pendingLevel, setPendingLevel] = useState(null);

    // Effect to trigger backend update after transaction success
    useEffect(() => {
        if (isTxSuccess && pendingLevel && hash) {
            toast.success(`Transaction Confirmed! Updating your level to ${pendingLevel}...`);
            updateSlotActivation({
                current_level_id: pendingLevel,
                tx_hash: hash
            });
            setPendingLevel(null);
            refetchBalance(); // Refresh USDT balance display
        }
    }, [isTxSuccess, pendingLevel, hash, updateSlotActivation, refetchBalance]);

    // Handle Transaction Error
    useEffect(() => {
        if (txError) {
            toast.error(`Transaction Failed: ${txError.shortMessage || txError.message}`);
            setPendingLevel(null);
        }
    }, [txError]);

    const handleActivate = (level) => {
        const threshold = LEVEL_THRESHOLDS[level];
        const currentBalance = parseFloat(walletData?.usdtBalance || '0');

        if (threshold && currentBalance < threshold) {
            toast.error(`Insufficient Balance! You need ${threshold} USDT to activate Level ${level}. (Current: ${currentBalance} USDT)`);
            return;
        }

        if (!dynamicTreasuryAddress) {
            toast.error("Protocol Error: Payment address not found. Please try again later.");
            return;
        }

        setPendingLevel(level);

        // Trigger USDT Transfer
        writeContract({
            address: USDT_ADDRESS,
            abi: USDT_ABI,
            functionName: 'transfer',
            args: [dynamicTreasuryAddress, parseUnits(threshold.toString(), 6)], // USDT usually has 6 decimals
        });
    };

    const isPending = isTxPending || isWaitingForTx || isUpdatingBackend;
    const activatingLevel = pendingLevel || (isUpdatingBackend ? variables?.current_level_id : null);

    const levels = [
        { level: 1, cost: "20", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 2, cost: "40", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 3, cost: "80", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 4, cost: "160", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 5, cost: "320", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 6, cost: "640", earnings: { level: "100", referral: "200", recycle: "40", matrix: "20" } },
        { level: 7, cost: "1280", earnings: { level: "100", referral: "200", recycle: "40", matrix: "20" } },
    ];

    if (isLoading) return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent-gold"></div></div>;

    return (
        <div className="min-h-screen bg-linear-to-b from-[#050505] via-[#0d0d0d] to-[#050505] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements for "Wow" effect */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#ff4500]/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-[1600px] mx-auto space-y-12 relative z-10">

                {/* Top Section: Heading & Protocol Statistics */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold flex flex-col items-start leading-[0.85] tracking-tighter">
                            <span className="text-[#FF4500] drop-shadow-[0_0_15px_rgba(255,69,0,0.3)]">MATRIX</span>
                            <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">ACTIVATION</span>
                        </h1>
                        <p className="mt-4 text-white/50 text-xs md:text-sm uppercase tracking-[0.4em] font-bold">
                            Decentralized Node Infrastructure Protocol
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-auto min-w-[320px] bg-white/5 p-6 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center gap-8 border-b border-white/5 pb-2">
                                <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest">Protocol Status</span>
                                <span className="text-green-500 font-display font-bold text-xs flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    V4.0 SECURED
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-8 border-b border-white/5 pb-2">
                                <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest">Active Nodes</span>
                                <span className="text-white font-display font-bold text-xs tracking-widest">{currentActiveLevel} / {levels.length}</span>
                            </div>
                            <div className="flex justify-between items-center gap-8">
                                <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest">Network Load</span>
                                <span className="text-gold font-display font-bold text-xs uppercase">Optimization Active</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section: Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {levels.map((lvl) => {
                        let status = 'locked';
                        if (lvl.level <= currentActiveLevel) status = 'active';
                        else if (lvl.level === currentActiveLevel + 1) status = 'available';

                        return (
                            <SlotLevelCard
                                key={lvl.level}
                                {...lvl}
                                status={status}
                                isActive={lvl.level <= currentActiveLevel}
                                onActivate={() => handleActivate(lvl.level)}
                                isPending={isPending}
                                activatingLevel={activatingLevel}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SlotActivation;
