import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useGetSlotActivation, useUpdateSlotActivation } from '../hooks/useSlotActivation';
import { useWalletBalance } from '../hooks/useWallet';
import SlotLevelCard from './SlotActivation/SlotLevelCard';
import ActivationModal from './SlotActivation/ActivationModal';
import { walletApiService } from '../services/walletApiService';
import { LEVEL_THRESHOLDS, LEVELS_DATA } from './SlotActivation/constants';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { getActiveNetwork } from '../config/networkConfig';
import { SLOT_ABI, USDT_ABI } from '../abis/SlotActivation';

const SlotActivation = () => {
    let user = null;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
            user = JSON.parse(storedUser);
        }
    } catch (e) { }

    const userId = user?.id;
    const { data: slotActivation, isLoading, error } = useGetSlotActivation(userId || '');
    const { mutate: updateSlotActivation, isPending: isUpdatingBackend, variables } = useUpdateSlotActivation(userId || '');
    const { data: walletData, refetch: refetchBalance } = useWalletBalance();

    const { address: userWalletAddress } = useAccount();
    const network = getActiveNetwork();
    const { writeContractAsync } = useWriteContract();

    // Check USDT allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: network.usdtAddress,
        abi: USDT_ABI,
        functionName: 'allowance',
        args: [userWalletAddress, network.slotActivationAddress],
    });

    const currentActiveLevel = slotActivation?.data?.current_level_id ?? slotActivation?.current_level_id ?? 1;
    const referrerAddress = slotActivation?.data?.referrer_address || slotActivation?.referrer_address || '0x0000000000000000000000000000000000000000';
    const [pendingLevel, setPendingLevel] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLevel, setModalLevel] = useState(null);
    const [modalCost, setModalCost] = useState(0);

    const handleActivate = (level) => {
        const threshold = LEVEL_THRESHOLDS[level];
        setModalLevel(level);
        setModalCost(threshold);
        setIsModalOpen(true);
    };

    const handleConfirmActivation = async (method) => {
        const level = modalLevel;
        const cost = modalCost;
        setPendingLevel(level);
        setIsModalOpen(false);

        try {
            let txHash = null;

            if (method === 'USDT') {
                const amountUnits = parseUnits(cost.toString(), 6); // USDT usually 6 decimals

                // 1. Check & Handle Allowance
                if (!allowance || allowance < amountUnits) {
                    toast.info("Approving USDT for activation...");
                    const approveTx = await writeContractAsync({
                        address: network.usdtAddress,
                        abi: USDT_ABI,
                        functionName: 'approve',
                        args: [network.slotActivationAddress, amountUnits * BigInt(10)], // Approve more to avoid repeat
                    });
                    // Wait a bit for approval (Ideally use useWaitForTransactionReceipt)
                    await new Promise(resolve => setTimeout(resolve, 4000));
                    refetchAllowance();
                }

                // 2. On-chain Activation
                toast.info("Submitting activation request to blockchain...");
                const activateTx = await writeContractAsync({
                    address: network.slotActivationAddress,
                    abi: SLOT_ABI,
                    functionName: 'activateSlot',
                    args: [referrerAddress, amountUnits]
                });
                txHash = activateTx;
                toast.success("Blockchain transaction confirmed! Syncing with platform...");
            }

            // 3. Update backend
            updateSlotActivation({
                current_level_id: level,
                payment_type: method,
                tx_hash: txHash || (method === 'USDT' ? 'MOCK_USDT_PAYMENT' : null)
            }, {
                onSuccess: () => {
                    toast.success(`Level ${level} Activation successful!`);
                    setPendingLevel(null);
                    refetchBalance();
                },
                onError: (error) => {
                    toast.error(`Backend sync failed: ${error.message}`);
                    setPendingLevel(null);
                }
            });
        } catch (err) {
            console.error(err);
            toast.error(err.shortMessage || err.message || "Transaction failed");
            setPendingLevel(null);
        }
    };

    const handleTopUp = async () => {
        try {
            await walletApiService.topUpInternal(1000);
            refetchBalance();
        } catch (e) {
            console.error(e);
        }
    };

    const isPending = isUpdatingBackend;
    const activatingLevel = pendingLevel || (isUpdatingBackend ? variables?.current_level_id : null);

    const levels = LEVELS_DATA;

    if (isLoading) return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent-gold"></div></div>;

    return (
        <div className="min-h-screen bg-linear-to-b py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
                                <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest">USDT TOKEN</span>
                                <span className="text-white font-display font-bold text-xs tracking-widest">{walletData?.usdtBalance || '0.00'} USDT</span>
                            </div>
                            <div className="flex justify-between items-center gap-8 border-b border-white/5 pb-2">
                                <span className="text-gold/40 text-[9px] uppercase font-bold tracking-widest">OWN TOKEN</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gold font-display font-bold text-xs tracking-widest">{walletData?.own_token || '0.00'} OWN</span>
                                    <button
                                        onClick={handleTopUp}
                                        className="px-2 py-0.5 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded text-gold text-[8px] font-black uppercase transition-all"
                                    >
                                        + Top Up
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-8">
                                <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest">Active Nodes</span>
                                <span className="text-white font-display font-bold text-xs tracking-widest">{currentActiveLevel} / {levels.length}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section: Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
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
                                user={user}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Activation Modal */}
            <ActivationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmActivation}
                level={modalLevel}
                cost={modalCost}
                usdtBalance={walletData?.usdtBalance || '0.00'}
                dbBalance={walletData?.own_token || '0.00'}
                isPending={isPending}
            />
        </div>
    );
};

export default SlotActivation;
