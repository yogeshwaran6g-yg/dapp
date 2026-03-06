import React from 'react';
import MatrixOrbital from './MatrixOrbital';

const SlotLevelCard = ({ level, cost, earnings, isActive, status, onActivate, isPending, activatingLevel, user }) => {
    const isActivatingThis = activatingLevel === level;
    const isLocked = status === 'locked';
    const isPremium = level === 7;

    return (
        <div className={`relative group transition-all duration-500 rounded-[32px] p-px ${isActive ? 'bg-linear-to-b from-[#d4af37]/40 to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.9)]' : 'bg-linear-to-b from-white/10 to-transparent shadow-2xl'}`}>
            {/* Inner Card Body */}
            <div className={`
                relative bg-linear-to-b from-[#3d2b24] to-[#2a1a15]
                rounded-[31px] p-3 flex flex-col items-center
                ${isLocked ? 'opacity-70 grayscale' : 'opacity-100'}
            `}>
                {/* Top Bar */}
                <div className="w-full flex justify-between items-center mb-0.5">
                    <div className="bg-white/10 px-2 py-1 rounded-lg border border-white/10">
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

                <MatrixOrbital level={level} isActive={isActive} user={user} />

                <h3 className="text-white text-lg font-display font-black tracking-[0.15em] mb-2 uppercase">
                    LEVEL {level < 10 ? `0${level}` : level}
                </h3>

                {/* Info Grid - More compact */}
                <div className="w-full grid grid-cols-3 gap-1.5 mb-2">
                    <div className="border border-white/5 p-1.5 rounded-lg flex flex-col items-start bg-white/5">
                        <span className="text-[7px] text-[#d4af37] font-black uppercase mb-0.5">NRG REWARD</span>
                        <span className="text-white text-[10px] font-bold">{earnings?.level || cost}</span>
                    </div>
                    <div className="border border-white/5 p-1.5 rounded-lg flex flex-col items-start bg-white/5">
                        <span className="text-[7px] text-[#d4af37] font-black uppercase mb-0.5">REFERRAL</span>
                        <span className="text-white text-[10px] font-bold">{earnings?.referral || '200'}</span>
                    </div>
                    <div className="border border-white/5 p-1.5 rounded-lg flex flex-col items-start bg-white/5">
                        <span className="text-[7px] text-[#d4af37] font-black uppercase mb-0.5">RECYCLE</span>
                        <span className="text-white text-[10px] font-bold">{earnings?.recycle || '40'}</span>
                    </div>
                </div>

                {/* Button */}
                {!isActive ? (
                    <button
                        onClick={() => onActivate(level)}
                        disabled={isLocked || isPending}
                        className={`
                        w-full py-2.5 rounded-lg font-display font-black text-[10px] uppercase transition-all duration-300
                        ${(isLocked || isPending)
                                ? 'bg-[#2a1a15]/50 text-[#6d4b3b] cursor-not-allowed border border-white/5'
                                : 'bg-linear-to-r from-[#d4af37] via-[#f7d581] to-[#8a6d3b] text-black shadow-[0_8px_20px_rgba(212,175,55,0.2)] hover:scale-[1.01]'
                            }
                    `}
                    >
                        {isLocked ? 'LOCKED' : (isActivatingThis ? 'ACTIVATING...' : 'ACTIVATE NOW')}
                    </button>
                ) : (
                    <div className="w-full py-2.5 rounded-lg bg-[#142319] border border-green-500/30 text-green-500 font-display font-black text-[10px] uppercase text-center shadow-inner">
                        ACTIVATED
                    </div>
                )}
            </div>
        </div>
    );
};

export default SlotLevelCard;
