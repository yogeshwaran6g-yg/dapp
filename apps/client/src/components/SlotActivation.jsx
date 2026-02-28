import React, { useState } from 'react';
import { useGetSlotActivation, useUpdateSlotActivation } from '../hooks/useSlotActivation';

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
    }
];

const SlotActivation = () => {
    const storedUser = localStorage.getItem('user');
    const userId = (storedUser && storedUser !== 'undefined' && storedUser !== 'null')
        ? JSON.parse(storedUser)?.id
        : null;
    const { data: slotActivation, isLoading, error } = useGetSlotActivation(userId);
    const { mutate: updateSlotActivation } = useUpdateSlotActivation(userId);

    const currentLevel = slotActivation?.current_level_id || 1;

    const handleActivate = (levelId) => {
        updateSlotActivation({ current_level_id: levelId });
    };

    return (
        <div className="relative flex-1 -m-4 sm:-m-8 flex flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-background-dark to-background-dark">
            {/* Header / Sub-header for Slot Activation */}
            <div className="px-4 sm:px-8 py-2 sm:py-3 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 bg-primary/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <h2 className="text-sm sm:text-base font-semibold tracking-tight">Activation Orbitals</h2>
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
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-32">
                <div className="max-w-6xl mx-auto px-4 sm:px-8">
                    <div className="mb-6 sm:mb-10">
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tighter mb-2 uppercase">Activation Orbitals</h1>
                        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">Unlock higher planetary dimensions to multiply your rewards and access premium governance protocols.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                        {LEVELS.map((level) => {
                            const isAchieved = level.id <= currentLevel;
                            const isAtLimit = currentLevel >= 6;
                            const isNextLevel = level.id === currentLevel + 1;
                            const isLocked = level.id > currentLevel + 1;

                            return (
                                <div key={level.id} className={`glass-card rounded-xl p-6 relative overflow-hidden group transition-all duration-300 ${isAchieved ? 'border-accent-purple/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'locked-card'}`}>
                                    <div className="absolute top-0 right-0 p-3">
                                        {isAchieved ? (
                                            <span className="px-2 py-1 bg-accent-purple/20 text-accent-purple text-[10px] font-black rounded uppercase tracking-wider">Active</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-white/10 text-zinc-300 text-[10px] font-black rounded uppercase tracking-wider">Locked</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center mb-6 pt-4">
                                        <div className={`orbital-container ${isLocked ? 'opacity-20' : isNextLevel ? 'opacity-70' : 'scale-75 sm:scale-100'}`}>
                                            <div className={`orbit orbit-1 ${!isAchieved && !isNextLevel ? 'border-white/10' : ''}`}></div>
                                            <div className={`orbit orbit-2 ${!isAchieved && !isNextLevel ? 'border-white/10' : ''}`}></div>
                                            <div className={`orbit orbit-3 ${isAchieved ? 'border-accent-purple/40' : 'border-white/10'}`}></div>
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${isAchieved ? level.glowColor : 'bg-zinc-800'} flex items-center justify-center`}>
                                                <span className={`material-symbols-outlined text-white text-lg sm:text-xl ${!isAchieved && !isNextLevel ? 'text-zinc-600' : ''}`}>
                                                    {isAchieved || isNextLevel ? level.icon : 'lock'}
                                                </span>
                                            </div>
                                            {(isAchieved || isNextLevel) && (
                                                <>
                                                    <div className={`planet h-2 sm:h-3 w-2 sm:w-3 top-[10px] left-[50px] ${level.planetColor}`}></div>
                                                    <div className="planet h-1.5 sm:h-2 w-1.5 sm:w-2 bottom-[30px] right-[10px] bg-zinc-400/50"></div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <h3 className={`text-2xl font-black leading-tight ${isAchieved ? 'text-white' : 'text-zinc-400'}`}>
                                                {level.title}
                                            </h3>
                                            <p className={`text-xs uppercase font-bold tracking-widest ${isAchieved ? 'text-zinc-500' : 'text-zinc-600'}`}>
                                                {level.subtitle}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className={`p-3 rounded-lg border border-white/5 transition-colors ${isAchieved ? 'bg-black/40' : 'bg-black/20'}`}>
                                                <p className={`text-[10px] mb-1 ${isAchieved ? 'text-zinc-500' : 'text-zinc-600'}`}>IGT BALANCE</p>
                                                <p className={`text-sm font-bold ${isAchieved ? 'text-accent-gold' : 'text-zinc-500'}`}>
                                                    {level.igtBalance}
                                                </p>
                                            </div>
                                            <div className={`p-3 rounded-lg border border-white/5 transition-colors ${isAchieved ? 'bg-black/40' : 'bg-black/20'}`}>
                                                <p className={`text-[10px] mb-1 ${isAchieved ? 'text-zinc-500' : 'text-zinc-600'}`}>CES VALUE</p>
                                                <p className={`text-sm font-bold ${isAchieved ? 'text-accent-purple' : 'text-zinc-500'}`}>
                                                    {level.cesValue}
                                                </p>
                                            </div>
                                        </div>

                                        {isNextLevel ? (
                                            <button
                                                onClick={() => handleActivate(level.id)}
                                                className="w-full py-3 bg-accent-gold text-primary font-black rounded-lg text-sm uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] animate-pulse"
                                            >
                                                Activate Now
                                            </button>
                                        ) : isAchieved ? (
                                            <div className="w-full py-3 bg-accent-purple/10 text-accent-purple border border-accent-purple/20 font-bold rounded-lg text-xs uppercase tracking-tight text-center">
                                                Achieved
                                            </div>
                                        ) : (
                                            <button className="w-full py-3 bg-white/5 text-zinc-600 border border-white/5 font-bold rounded-lg text-xs uppercase tracking-tight cursor-not-allowed" disabled>
                                                {isLocked ? 'Locked' : 'Achieve previous level'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Sticky Footer Info */}
            <footer className="shrink-0 bg-primary/95 backdrop-blur-xl border-t border-white/10 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 absolute bottom-0 left-0 right-0 z-20">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Current Multiplier</span>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent-purple animate-pulse"></span>
                            <span className="text-sm font-black text-white">+{12.5 * currentLevel}% <span className="text-accent-purple">APY</span></span>
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Status</span>
                        <span className="text-xs font-bold text-accent-gold uppercase">Orbit {currentLevel} Active</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Network Fee</span>
                        <p className="text-[10px] font-black text-zinc-400">0.0002 SOL</p>
                    </div>
                    <button
                        className="bg-white/5 hover:bg-white/10 text-[10px] font-black px-6 py-2 rounded-lg border border-white/10 transition-all uppercase tracking-widest hover:border-white/20 active:scale-95"
                        onClick={() => window.location.reload()}
                    >
                        Refresh
                    </button>
                </div>
            </footer>

        </div>
    );
};

export default SlotActivation;
