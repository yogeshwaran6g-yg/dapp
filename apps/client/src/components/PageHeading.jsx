import React from 'react';

const PageHeading = ({ title, highlight, badge, subtitle }) => {
    return (
        <div className="mb-12 max-w-7xl">
            <div className="space-y-4">
                {badge && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-[2px] bg-accent-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]"></div>
                        <span className="text-[10px] font-display font-bold tracking-[0.4em] text-accent-gold uppercase italic">
                            {badge}
                        </span>
                    </div>
                )}

                <h1 className="text-3xl md:text-5xl font-display font-black italic tracking-tighter uppercase leading-[0.9] flex flex-col">
                    {highlight && <span className="gold-gradient-text">{highlight}</span>}
                    <span className="text-white pl-1">{title}</span>
                </h1>

                {subtitle && (
                    <div className="border-l-2 border-accent-gold/20 pl-4 mt-6">
                        <p className="text-white/50 text-xs sm:text-base max-w-2xl leading-relaxed">
                            {subtitle}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeading;
