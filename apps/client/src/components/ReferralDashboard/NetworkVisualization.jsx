import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NetworkVisualization = () => {
    const [hoveredNode, setHoveredNode] = React.useState(null);
    const [username, setUsername] = React.useState('');

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.username) {
                    setUsername(user.username);
                } else if (user.wallet_address) {
                    const addr = user.wallet_address;
                    setUsername(`${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`);
                }
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
            }
        }
    }, []);

    // Dynamic 6 rings configuration
    const ringConfig = [
        { id: 'ring-1', size: 240, duration: 25, label: 'L1: Core', color: '#FF8C00', icon: 'hub' },
        { id: 'ring-2', size: 360, duration: 35, label: 'L2: Primary', color: '#FF4500', icon: 'person' },
        { id: 'ring-3', size: 480, duration: 45, label: 'L3: Secondary', color: '#FFA500', icon: 'groups' },
        { id: 'ring-4', size: 600, duration: 55, label: 'L4: Tertiary', color: '#FFD700', icon: 'share' },
        { id: 'ring-5', size: 720, duration: 65, label: 'L5: Quaternary', color: '#B08D57', icon: 'language' },
        { id: 'ring-6', size: 840, duration: 75, label: 'L6: Global', color: '#C0C0C0', icon: 'public' },
    ];

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
                    {ringConfig.map((ring) => (
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
                            {/* Single Planet per Ring */}
                            <motion.div
                                className="absolute w-full h-full"
                                style={{
                                    top: 0,
                                    left: 0,
                                    transformStyle: 'preserve-3d'
                                }}
                                animate={{ rotateZ: 360 }}
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
                                    animate={{ rotateZ: -360 }}
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
                                            onHoverStart={() => setHoveredNode({ label: ring.label, color: ring.color, detail: `Active node on ${ring.label} ring. Click for node telemetry.` })}
                                            onHoverEnd={() => setHoveredNode(null)}
                                        >
                                            <div
                                                className="rounded-full gold-gradient-bg border-[3px] border-[#0a0a0a] relative"
                                                style={{
                                                    width: 40 - (ringConfig.indexOf(ring) * 2), // Slightly smaller sizes for outer rings
                                                    height: 40 - (ringConfig.indexOf(ring) * 2),
                                                    boxShadow: `0 0 25px ${ring.color}66, inset 0 0 10px rgba(0,0,0,0.3)`
                                                }}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-black !text-[14px] opacity-60">{ring.icon}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    ))}

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
                            className="size-20 sm:size-24 gold-gradient-bg rounded-full border-[6px] border-[#0a0a0a] flex items-center justify-center cursor-pointer relative"
                            style={{
                                boxShadow: '0 0 50px rgba(255, 140, 0, 0.4), inset 0 0 15px rgba(0,0,0,0.3)'
                            }}
                            animate={{
                                scale: [1, 1.08, 1],
                                boxShadow: [
                                    '0 0 40px rgba(255, 140, 0, 0.3)',
                                    '0 0 70px rgba(255, 140, 0, 0.5)',
                                    '0 0 40px rgba(255, 140, 0, 0.3)'
                                ]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span className="material-symbols-outlined text-black !text-3xl font-black">person</span>
                            <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping opacity-10"></div>
                        </motion.div>

                        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-center w-max pointer-events-none">
                            <p className="text-[10px] font-black gold-gradient-text uppercase tracking-[0.2em] drop-shadow-lg">
                                {username || 'NODE CONTROLLER'}
                            </p>
                            <p className="text-[8px] text-silver/60 font-bold mt-0.5 uppercase">Network Core</p>
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
                            className="absolute bottom-6 right-6 p-4 rounded-xl border border-white/10 z-[100] min-w-[160px]"
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
            </div>
        </div>
    );
};

export default NetworkVisualization;
