import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReferralNetwork } from '../../hooks/useReferral';
import { useGetProfile } from '../../hooks/useProfile';

const NetworkVisualization = () => {
    const [hoveredNode, setHoveredNode] = React.useState(null);
    const { data: network, isLoading } = useReferralNetwork();
    const [userId, setUserId] = React.useState(null);
    const [walletAddr, setWalletAddr] = React.useState('');

    // Fetch the latest profile data for the center node
    const { data: profileData } = useGetProfile(userId);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserId(user.id);
                setWalletAddr(user.wallet_address);
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
            }
        }
    }, []);

    const currentUser = profileData?.data || { username: '', wallet_address: walletAddr };

    // Helper to get initials or first letter
    const getInitials = (name, wallet) => {
        if (name && name.trim()) return name.substring(0, 1).toUpperCase();
        if (wallet && wallet.length > 5) {
            // Use first alphanumeric char after 0x
            const clean = wallet.startsWith('0x') ? wallet.substring(2) : wallet;
            return clean.substring(0, 1).toUpperCase();
        }
        return '?';
    };

    // Helper to format short address
    const shortAddr = (addr) => addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '';

    // Dynamic 6 rings configuration
    const ringConfig = [
        { id: 'ring-1', size: 240, duration: 25, label: 'L1: Core', color: '#FF8C00' },
        { id: 'ring-2', size: 360, duration: 35, label: 'L2: Primary', color: '#FF4500' },
        { id: 'ring-3', size: 480, duration: 45, label: 'L3: Secondary', color: '#FFA500' },
        { id: 'ring-4', size: 600, duration: 55, label: 'L4: Tertiary', color: '#FFD700' },
        { id: 'ring-5', size: 720, duration: 65, label: 'L5: Quaternary', color: '#B08D57' },
        { id: 'ring-6', size: 840, duration: 75, label: 'L6: Global', color: '#C0C0C0' },
    ];

    // Group referrals by level
    const groupedNetwork = React.useMemo(() => {
        const groups = {};
        if (network) {
            network.forEach(user => {
                const level = parseInt(user.level);
                if (!groups[level]) groups[level] = [];
                groups[level].push(user);
            });
        }
        return groups;
    }, [network]);

    const generateStars = () => {
        return Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.1,
            duration: Math.random() * 3 + 2
        }));
    };
    const stars = React.useMemo(() => generateStars(), []);

    return (
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden relative min-h-[600px] flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-start/5 blur-[100px] -z-10"></div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 relative z-20 gap-3">
                <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 sm:gap-3">
                    <span className="material-symbols-outlined text-gold-start text-base sm:text-xl">star</span>
                    <span className="truncate">NETWORK ARCHITECTURE</span>
                </h2>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gold-start/10 rounded-full text-[8px] sm:text-[10px] text-gold-start border border-gold-start/20 uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <span className="size-1 bg-gold-start rounded-full animate-pulse"></span>
                        6-Tier Protocol
                    </span>
                </div>
            </div>

            <div className="relative flex-grow flex items-center justify-center perspective-[2000px] py-12">
                {/* Star Field Background */}
                <div className="absolute inset-0 pointer-events-none">
                    {stars.map(star => (
                        <motion.div
                            key={star.id}
                            className="absolute bg-white rounded-full"
                            style={{
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
                                opacity: star.opacity
                            }}
                            animate={{ opacity: [star.opacity, star.opacity * 2, star.opacity] }}
                            transition={{ duration: star.duration, repeat: Infinity }}
                        />
                    ))}
                </div>

                {/* Perspective Container */}
                <div className="relative w-full h-full flex items-center justify-center transform-gpu" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(50deg)' }}>

                    {/* Orbit Rings */}
                    {ringConfig.map((ring, rIdx) => {
                        const level = rIdx + 1;
                        const members = groupedNetwork[level] || [];

                        return (
                            <div
                                key={ring.id}
                                className="absolute rounded-full border border-white/10"
                                style={{
                                    width: ring.size,
                                    height: ring.size,
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    transformStyle: 'preserve-3d',
                                    background: 'radial-gradient(circle, transparent 60%, rgba(255,255,255,0.03) 100%)'
                                }}
                            >
                                {/* Active Referrals on this Ring */}
                                {members.map((user, uIdx) => {
                                    const angle = (360 / members.length) * uIdx;

                                    return (
                                        <motion.div
                                            key={user.id}
                                            className="absolute w-full h-full"
                                            style={{
                                                top: 0,
                                                left: 0,
                                                transformStyle: 'preserve-3d',
                                                rotateZ: angle
                                            }}
                                            animate={{ rotateZ: angle + 360 }}
                                            transition={{
                                                duration: ring.duration,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                        >
                                            <motion.div
                                                className="absolute pointer-events-none"
                                                style={{
                                                    top: '50%',
                                                    left: '100%',
                                                    width: 0,
                                                    height: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transformStyle: 'preserve-3d'
                                                }}
                                                animate={{ rotateZ: -(angle + 360) }}
                                                transition={{
                                                    duration: ring.duration,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            >
                                                <div
                                                    className="pointer-events-auto"
                                                    style={{
                                                        transform: 'rotateX(-50deg)',
                                                        transformStyle: 'preserve-3d'
                                                    }}
                                                >
                                                    <motion.div
                                                        className="cursor-pointer"
                                                        whileHover={{ scale: 1.3 }}
                                                        onHoverStart={() => setHoveredNode({
                                                            label: user.username || shortAddr(user.wallet_address),
                                                            color: ring.color,
                                                            detail: `Loyal member status on ${ring.label}. Part of your growing matrix team.`
                                                        })}
                                                        onHoverEnd={() => setHoveredNode(null)}
                                                    >
                                                        <div
                                                            className="rounded-full bg-linear-to-br from-gold-start via-gold-mid to-gold-end border-[2.5px] border-[#0a0a0a] relative flex items-center justify-center overflow-hidden"
                                                            style={{
                                                                width: 38 - (rIdx * 2.5),
                                                                height: 38 - (rIdx * 2.5),
                                                                boxShadow: `0 0 20px ${ring.color}44, inset 0 0 10px rgba(0,0,0,0.3)`
                                                            }}
                                                        >
                                                            {user.avatar_url ? (
                                                                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-black font-black text-[10px] leading-none">
                                                                    {getInitials(user.username, user.wallet_address)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {/* Central Sun/User */}
                    <div
                        className="absolute z-50"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotateX(-50deg)',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        <motion.div
                            className="size-20 sm:size-24 bg-linear-to-br from-gold-start via-gold-mid to-gold-end rounded-full border-[6px] border-[#0a0a0a] flex items-center justify-center cursor-pointer relative overflow-hidden"
                            style={{
                                boxShadow: '0 0 50px rgba(255, 140, 0, 0.4), inset 0 0 15px rgba(0,0,0,0.3)'
                            }}
                            animate={{
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    '0 0 40px rgba(255, 140, 0, 0.3)',
                                    '0 0 70px rgba(255, 140, 0, 0.5)',
                                    '0 0 40px rgba(255, 140, 0, 0.3)'
                                ]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {currentUser?.avatar_url ? (
                                <img src={currentUser.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-black font-black text-3xl">
                                    {getInitials(currentUser?.username, currentUser?.wallet_address)}
                                </span>
                            )}
                            <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping opacity-10"></div>
                        </motion.div>

                        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-center w-max pointer-events-none">
                            <p className="text-[10px] font-black bg-linear-to-r from-gold-start via-gold-mid to-gold-end bg-clip-text text-transparent uppercase tracking-[0.2em] drop-shadow-lg">
                                {currentUser?.username || shortAddr(currentUser?.wallet_address) || 'NODE CONTROLLER'}
                            </p>
                            <p className="text-[8px] text-silver/60 font-bold mt-0.5 uppercase tracking-widest">Network Core</p>
                        </div>
                    </div>
                </div>

                {/* Interactive Info Overlay */}
                <AnimatePresence>
                    {hoveredNode && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute bottom-6 right-6 p-4 rounded-xl border border-white/10 z-[100] min-w-[180px]"
                            style={{
                                background: 'rgba(11, 11, 15, 0.9)',
                                backdropFilter: 'blur(12px)',
                                boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${hoveredNode.color}22`
                            }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="size-2 rounded-full" style={{ backgroundColor: hoveredNode.color, boxShadow: `0 0 8px ${hoveredNode.color}` }}></div>
                                <p className="text-white text-[10px] font-black uppercase tracking-widest">{hoveredNode.label}</p>
                            </div>
                            <p className="text-silver/60 text-[9px] font-bold leading-relaxed">{hoveredNode.detail}</p>
                            <div className="mt-3 overflow-hidden h-1 bg-white/5 rounded-full">
                                <motion.div
                                    className="h-full"
                                    style={{ backgroundColor: hoveredNode.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading State Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="size-8 border-2 border-gold-start/20 border-t-gold-start rounded-full animate-spin"></div>
                            <p className="text-[10px] text-gold-start font-black tracking-widest uppercase">Syncing Network...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NetworkVisualization;
