import React, { useState } from 'react';
import { useGetSlotActivation, useUpdateSlotActivation } from '../hooks/useSlotActivation';

const SlotActivation = () => {
    const { data: slotActivation, isLoading, error } = useGetSlotActivation();
    const { mutate: updateSlotActivation } = useUpdateSlotActivation();
    
    return (
        <div className="flex-1 -m-4 sm:-m-8 flex flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-background-dark to-background-dark">
            {/* Header / Sub-header for Slot Activation */}
            <div className="px-4 sm:px-8 py-2 sm:py-3 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 bg-primary/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <h2 className="text-sm sm:text-base font-semibold tracking-tight">Slot Activation</h2>
                    <div className="h-4 w-[1px] bg-white/10 mx-1 sm:mx-2"></div>
                    <div className="flex items-center gap-2 px-3 py-0.5 bg-white/5 rounded-full border border-white/5 shrink-0">
                        <span className="material-symbols-outlined text-[10px] sm:text-xs text-accent-gold">stars</span>
                        <span className="text-[10px] font-bold text-zinc-300">Phase 2</span>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 sm:gap-6 w-full sm:w-auto">
                    <div className="flex gap-2">
                        <div className="px-2 sm:px-4 py-1 sm:py-1.5 bg-white/5 rounded-lg border border-white/5 flex flex-col items-end">
                            <span className="text-[8px] sm:text-[9px] text-zinc-500 leading-none lowercase">IGT</span>
                            <span className="text-xs font-bold leading-tight">5,240</span>
                        </div>
                        <div className="px-2 sm:px-4 py-1 sm:py-1.5 bg-white/5 rounded-lg border border-white/5 flex flex-col items-end">
                            <span className="text-[8px] sm:text-[9px] text-zinc-500 leading-none lowercase">CES</span>
                            <span className="text-xs font-bold leading-tight">1,200</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-8">
                    <div className="mb-6 sm:mb-10">
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tighter mb-2 uppercase">Activation Orbitals</h1>
                        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">Unlock higher planetary dimensions to multiply your rewards and access premium governance protocols.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                        {/* Level 01 - ACTIVE */}
                        <div className="glass-card rounded-xl p-6 relative overflow-hidden group border-accent-purple/30">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="px-2 py-1 bg-accent-purple/20 text-accent-purple text-[10px] font-black rounded uppercase tracking-wider">Active</span>
                            </div>
                            <div className="flex flex-col items-center mb-6 pt-4">
                                <div className="orbital-container scale-75 sm:scale-100">
                                    <div className="orbit orbit-1"></div>
                                    <div className="orbit orbit-2"></div>
                                    <div className="orbit orbit-3 border-accent-purple/40"></div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glow-purple flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-lg sm:text-xl">rocket_launch</span>
                                    </div>
                                    <div className="planet h-2 sm:h-3 w-2 sm:w-3 top-[10px] left-[50px] glow-gold"></div>
                                    <div className="planet h-1.5 sm:h-2 w-1.5 sm:w-2 bottom-[30px] right-[10px] bg-zinc-400"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-2xl font-black text-white leading-tight">LEVEL 01</h3>
                                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Initial Singularity</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-500 mb-1">IGT BALANCE</p>
                                        <p className="text-sm font-bold text-accent-gold">1,450</p>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-500 mb-1">CES VALUE</p>
                                        <p className="text-sm font-bold text-accent-purple">420</p>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-accent-gold text-primary font-black rounded-lg text-sm uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                                    Activate Now
                                </button>
                            </div>
                        </div>

                        {/* Level 02 - LOCKED */}
                        <div className="glass-card locked-card rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="px-2 py-1 bg-white/10 text-zinc-300 text-[10px] font-black rounded uppercase tracking-wider">Locked</span>
                            </div>
                            <div className="flex flex-col items-center mb-6 pt-4">
                                <div className="orbital-container opacity-50">
                                    <div className="orbit orbit-1 border-white/10"></div>
                                    <div className="orbit orbit-2 border-white/10"></div>
                                    <div className="orbit orbit-3 border-white/10"></div>
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-zinc-600 text-xl">lock</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-2xl font-black text-zinc-400 leading-tight">LEVEL 02</h3>
                                    <p className="text-xs text-zinc-600 uppercase font-bold tracking-widest">Planetary Orbit</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-600 mb-1">IGT BALANCE</p>
                                        <p className="text-sm font-bold text-zinc-500">2,800</p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-600 mb-1">CES VALUE</p>
                                        <p className="text-sm font-bold text-zinc-500">850</p>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-white/5 text-zinc-600 border border-white/5 font-bold rounded-lg text-xs uppercase tracking-tight cursor-not-allowed" disabled>
                                    Achieve previous level
                                </button>
                            </div>
                        </div>

                        {/* Level 03 - LOCKED */}
                        <div className="glass-card locked-card rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="px-2 py-1 bg-white/10 text-zinc-300 text-[10px] font-black rounded uppercase tracking-wider">Locked</span>
                            </div>
                            <div className="flex flex-col items-center mb-6 pt-4">
                                <div className="orbital-container opacity-30">
                                    <div className="orbit orbit-1 border-white/10"></div>
                                    <div className="orbit orbit-2 border-white/10"></div>
                                    <div className="orbit orbit-3 border-white/10"></div>
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-zinc-600 text-xl">lock</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-2xl font-black text-zinc-400 leading-tight">LEVEL 03</h3>
                                    <p className="text-xs text-zinc-600 uppercase font-bold tracking-widest">Galactic Core</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-600 mb-1">IGT BALANCE</p>
                                        <p className="text-sm font-bold text-zinc-500">5,000</p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-600 mb-1">CES VALUE</p>
                                        <p className="text-sm font-bold text-zinc-500">1,200</p>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-white/5 text-zinc-600 border border-white/5 font-bold rounded-lg text-xs uppercase tracking-tight cursor-not-allowed" disabled>
                                    Achieve previous level
                                </button>
                            </div>
                        </div>

                        {/* Level 04 - LOCKED */}
                        <div className="glass-card locked-card rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="px-2 py-1 bg-white/10 text-zinc-300 text-[10px] font-black rounded uppercase tracking-wider">Locked</span>
                            </div>
                            <div className="flex flex-col items-center mb-6 pt-4">
                                <div className="orbital-container opacity-20">
                                    <div className="orbit orbit-1 border-white/10"></div>
                                    <div className="orbit orbit-2 border-white/10"></div>
                                    <div className="orbit orbit-3 border-white/10"></div>
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-zinc-600 text-xl">lock</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-2xl font-black text-zinc-400 leading-tight">LEVEL 04</h3>
                                    <p className="text-xs text-zinc-600 uppercase font-bold tracking-widest">Cosmic Horizon</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-600 mb-1">IGT BALANCE</p>
                                        <p className="text-sm font-bold text-zinc-500">12,500</p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-600 mb-1">CES VALUE</p>
                                        <p className="text-sm font-bold text-zinc-500">3,400</p>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-white/5 text-zinc-600 border border-white/5 font-bold rounded-lg text-xs uppercase tracking-tight cursor-not-allowed" disabled>
                                    Achieve previous level
                                </button>
                            </div>
                        </div>

                        {/* Level 05 - LOCKED */}
                        <div className="glass-card locked-card rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="px-2 py-1 bg-white/10 text-zinc-300 text-[10px] font-black rounded uppercase tracking-wider">Locked</span>
                            </div>
                            <div className="flex flex-col items-center mb-6 pt-4">
                                <div className="orbital-container opacity-10">
                                    <div className="orbit orbit-1 border-white/10"></div>
                                    <div className="orbit orbit-2 border-white/10"></div>
                                    <div className="orbit orbit-3 border-white/10"></div>
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-zinc-600 text-xl">lock</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-2xl font-black text-zinc-400 leading-tight">LEVEL 05</h3>
                                    <p className="text-xs text-zinc-600 uppercase font-bold tracking-widest">Hyperdimensional</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-600 mb-1">IGT BALANCE</p>
                                        <p className="text-sm font-bold text-zinc-500">25,000</p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-[10px] text-zinc-600 mb-1">CES VALUE</p>
                                        <p className="text-sm font-bold text-zinc-500">7,200</p>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-white/5 text-zinc-600 border border-white/5 font-bold rounded-lg text-xs uppercase tracking-tight cursor-not-allowed" disabled>
                                    Achieve previous level
                                </button>
                            </div>
                        </div>

                        {/* Level 06 - PREMIUM COMING SOON */}
                        <div className="glass-card locked-card rounded-xl p-6 relative overflow-hidden group flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-accent-gold/5 border-dashed border-white/10">
                            <div className="flex flex-col items-center text-center py-10">
                                <span className="material-symbols-outlined text-accent-gold text-4xl mb-4">stars</span>
                                <h3 className="text-lg font-bold text-zinc-500">Premium Tiers</h3>
                                <p className="text-xs text-zinc-600 mt-2 max-w-[150px]">Coming soon to the celestial expansion</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer Info */}
            <footer className="bg-primary/95 backdrop-blur-md border-t border-white/10 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 absolute bottom-0 left-0 right-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Active Slot Reward</span>
                        <span className="text-[10px] sm:text-xs font-black text-accent-purple whitespace-nowrap">+12.5% APY</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <p className="text-[8px] sm:text-[10px] font-medium text-zinc-500 uppercase">TRANSACTION FEES: 0.002 SOL</p>
                    <button className="bg-white/5 hover:bg-white/10 text-[8px] sm:text-[10px] font-bold px-3 py-1.5 rounded border border-white/5 transition-colors shrink-0">
                        REFRESH
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default SlotActivation;
