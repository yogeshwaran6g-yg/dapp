import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useReferralStats } from '../../hooks/useReferral';
import { toast } from 'react-hot-toast';

const StatsCards = () => {
    const { user } = useAuthContext();
    const { data: stats, isLoading } = useReferralStats();

    const referralCode = user?.referral_code || '...';
    const referralLink = `${window.location.origin}/?ref=${referralCode}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        toast.success('Referral link copied!');
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-gold-start/10 transition-colors">
                    <span className="material-symbols-outlined text-4xl! sm:text-5xl!">person_add</span>
                </div>
                <p className="text-silver/60 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">Direct Referrals</p>
                <div className="mt-2 sm:mt-4 flex items-end gap-2 sm:gap-3">
                    <h3 className="text-xl sm:text-2xl font-black">
                        {isLoading ? '...' : (stats?.directCount || 0)}
                    </h3>
                    <span className="text-green-400 text-[10px] font-bold mb-0.5 sm:mb-1">+0%</span>
                </div>
            </div>

            <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-gold-start/10 transition-colors">
                    <span className="material-symbols-outlined text-4xl! sm:text-5xl!">groups_3</span>
                </div>
                <p className="text-silver/60 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">Total Team Size</p>
                <div className="mt-2 sm:mt-4 flex items-end gap-2 sm:gap-3">
                    <h3 className="text-xl sm:text-2xl font-black">
                        {isLoading ? '...' : (stats?.teamSize || 0)}
                    </h3>
                    <span className="text-green-400 text-[10px] font-bold mb-0.5 sm:mb-1">+0%</span>
                </div>
            </div>

            <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-gold-start/10 transition-colors">
                    <span className="material-symbols-outlined text-4xl! sm:text-5xl!">bolt</span>
                </div>
                <p className="text-silver/60 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">Referral Earnings</p>
                <div className="mt-2 sm:mt-4 flex items-end gap-2 sm:gap-3">
                    <h3 className="text-xl sm:text-2xl font-black gold-gradient-text">
                        {isLoading ? '...' : (stats?.referralEarnings || 0).toFixed(2)}
                    </h3>
                    <span className="text-silver text-[9px] font-bold mb-1 ml-0.5">OWN</span>
                </div>
            </div>

            <div className="glass-card p-4 rounded-2xl border-gold-start/20 flex flex-col justify-between group/card hover:border-gold-start/40 transition-colors">
                <div>
                    <p className="text-silver/60 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">Referral Link</p>
                    <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/5 group-hover/card:border-gold-start/20 transition-all">
                        <p className="text-[10px] font-mono text-silver truncate">{referralLink}</p>
                    </div>
                </div>
                <button
                    onClick={copyToClipboard}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gold-start/30 text-gold-start text-[9px] sm:text-[10px] font-bold hover:bg-gold-start hover:text-primary transition-all active:scale-95 shadow-lg shadow-gold-start/5"
                >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    Copy Link
                </button>
            </div>
        </div>
    );
};

export default StatsCards;
