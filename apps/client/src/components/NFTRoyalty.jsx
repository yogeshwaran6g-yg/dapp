import React from 'react';

const nftTiers = [
    {
        tier: 1,
        name: 'Basic Tier',
        subtitle: 'Foundation Access',
        price: '500 NRG',
        priceUsd: '$50.00 USD',
        royaltyShare: '2% APY',
        estMonthly: '$15.00',
        active: false,
        activeCount: 0,
        popular: false,
        premium: false,
        imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCLrofueeO9lkntvfusMocAhHyxn9HTFKTqwDWnMNS4RpNIRad-WbnAcevswXdLb6tpQX3NketEBniAf4eES92mwEOhqucV_DWxKujIcuJ2o23Tjeyle6ISOtpac_h5Wpg9hmOzvXZDoUgAGZXiajAdOVWMFAdBlb8vQpJH3Fi4nzopnZeZFgGKYwVWiuPbxr_72NSJcKi1cQ95A8z0n0fOMvXd93WmHwNJndDew25uelsCZ5e1vD6DLLg3K8QW3YagruVLND9kJQxa',
        imageAlt: 'Abstract blue and violet wave pattern',
    },
    {
        tier: 2,
        name: 'Advanced Tier',
        subtitle: 'Optimized Rewards',
        price: '2,500 NRG',
        priceUsd: '$250.00 USD',
        royaltyShare: '5% APY',
        estMonthly: '$80.00',
        active: true,
        activeCount: 1,
        popular: true,
        premium: false,
        imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCXW6wUWtY60U9QwxCjmlf4cm8_W2uEeRVXf2hP6MOnMR97nI_EE1IvliXZe0V_UOJPGyKtZALI5Gflgx8LEFqc8ffs_sku7dpTAthlR_5MQA1W-NuOYJwj1caBuQaHLSb4-hSVDrHLil9GoPRA0kPzRLL-kouauyLpe_nD_TOtK3OvtQX7Ws8BPbnkGAjYB4Fm2UjbvbwkuCUg9Kj_8LFSu-MUFRk3rbjw45mEGYxpiLQo9dN8rxznL9z2TNZQgwVX4MUC2eHCeY3Z',
        imageAlt: 'Futuristic gold and black geometric shapes',
    },
    {
        tier: 3,
        name: 'Premium Tier',
        subtitle: 'Whale Benefits',
        price: '10,000 NRG',
        priceUsd: '$1,000.00 USD',
        royaltyShare: '12% APY',
        estMonthly: '$400.00',
        active: true,
        activeCount: 2,
        popular: false,
        premium: true,
        imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuC8bYSiytFG1DuqozQKPf7rXvzhYhtlOuZZ_shQ6oXFxZnZByOAJyeY7t26PjMLVnq1CVmG9hUXIq5st9PFKotAUkSLNT4O5D3SMKO2TLwQhjhN7bpkWoCbfiVLHZ4WJbySTzYyamf0iVJ-EDe_aVzbASUCqT9V1EITgHuCsnDYKfhZAfgFyRpfXICQz8q2ISXiJv0fHaLFQmLZyZ7KRL8PViWs0mwy20_7UhDur8G0kSDsyfraXw_-UnY28EMV-xrtcxag-eIR5lov',
        imageAlt: 'Luxurious golden liquid flowing abstract',
    },
];

const NFTTierCard = ({ tier }) => {
    const isActive = tier.active;
    const statusLabel = isActive
        ? tier.activeCount > 1
            ? `Active (x${tier.activeCount})`
            : 'Active'
        : 'Inactive';

    const cardBorderClass = tier.premium
        ? 'nft-gold-border border-accent-gold shadow-[0_0_30px_rgba(212,175,55,0.1)]'
        : tier.popular
            ? 'nft-gold-border border-accent-gold/30'
            : 'nft-gold-border/10';

    const buttonContent = isActive ? (
        <button className="w-full py-3 rounded-lg gold-gradient-bg text-primary font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all text-sm">
            {tier.premium ? 'Purchase Additional' : 'Manage Allocation'}
        </button>
    ) : (
        <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 font-bold transition-all text-sm">
            Activate Now
        </button>
    );

    return (
        <div
            className={`glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${cardBorderClass} relative`}
        >
            {/* Most Popular Badge */}
            {tier.popular && (
                <div className="absolute top-0 right-0 z-20">
                    <div className="gold-gradient-bg text-primary text-[10px] font-black px-4 py-1 rounded-bl-lg uppercase tracking-widest shadow-lg">
                        Most Popular
                    </div>
                </div>
            )}

            {/* Image */}
            <div className="aspect-[4/5] relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${tier.imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                    <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isActive
                                ? 'bg-accent-gold text-primary border-accent-gold/30'
                                : 'bg-white/10 backdrop-blur-md text-white border-white/10'
                            }`}
                    >
                        Tier {tier.tier}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3
                            className={`text-xl font-bold ${tier.premium ? 'gold-gradient-text' : ''
                                }`}
                        >
                            {tier.name}
                        </h3>
                        <p className="text-white/50 text-sm">{tier.subtitle}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-black">{tier.price}</div>
                        <div className="text-white/40 text-xs">{tier.priceUsd}</div>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm py-2 border-b border-white/5">
                        <span className="text-white/50">Royalty Share</span>
                        <span className="font-bold text-accent-gold">
                            {tier.royaltyShare}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-white/5">
                        <span className="text-white/50">Est. Monthly</span>
                        <span className="font-bold">{tier.estMonthly}</span>
                    </div>
                    <div className="flex items-center gap-2 py-2">
                        <span
                            className={`size-2 rounded-full ${isActive
                                    ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                                    : 'bg-white/20'
                                }`}
                        />
                        <span
                            className={`text-xs font-bold uppercase tracking-widest ${isActive
                                    ? 'text-green-400'
                                    : 'text-white/40 italic font-medium'
                                }`}
                        >
                            {statusLabel}
                        </span>
                    </div>
                </div>

                {buttonContent}
            </div>
        </div>
    );
};

const NFTRoyalty = () => {
    return (
        <div className="w-full">
            {/* Hero Header */}
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 mb-4">
                    <span className="material-symbols-outlined text-accent-gold text-sm">
                        verified
                    </span>
                    <span className="text-accent-gold text-xs font-bold uppercase tracking-widest">
                        Ecosystem Rewards Active
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                    NFT <span className="gold-gradient-text">Royalty</span> Program
                </h1>
                <p className="text-white/50 text-base max-w-2xl leading-relaxed">
                    Activate premium tier NFTs to secure your share of the global
                    ecosystem revenue. Rewards are distributed every 72 hours directly
                    to your connected wallet.
                </p>
            </div>

            {/* Royalty Pool Overview */}
            <section className="mb-14">
                <div className="glass-card rounded-xl p-8 relative overflow-hidden nft-gold-border">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 size-40 bg-accent-gold/10 blur-[80px] rounded-full" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {/* Total Pool */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-white/40 mb-1">
                                <span className="material-symbols-outlined text-sm">
                                    account_balance_wallet
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    Total Royalty Pool
                                </span>
                            </div>
                            <div className="text-3xl font-black text-white">
                                $1,250,400.00
                            </div>
                            <div className="flex items-center gap-1 text-green-400 text-sm font-medium">
                                <span className="material-symbols-outlined text-sm">
                                    trending_up
                                </span>
                                12.5% increase this cycle
                            </div>
                        </div>

                        {/* Countdown */}
                        <div className="flex flex-col gap-2 border-x border-white/10 px-0 md:px-8">
                            <div className="flex items-center gap-2 text-white/40 mb-1">
                                <span className="material-symbols-outlined text-sm">
                                    schedule
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    Next Distribution
                                </span>
                            </div>
                            <div className="text-3xl font-black gold-gradient-text tabular-nums">
                                02d 14h 55m
                            </div>
                            <div className="text-white/40 text-sm font-medium">
                                Snapshot in 18 hours
                            </div>
                        </div>

                        {/* User Share */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-white/40 mb-1">
                                <span className="material-symbols-outlined text-sm">
                                    stars
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    Your Estimated Share
                                </span>
                            </div>
                            <div className="text-3xl font-black text-white">$452.20</div>
                            <div className="flex items-center gap-1 text-accent-gold text-sm font-medium">
                                <span className="material-symbols-outlined text-sm">
                                    bolt
                                </span>
                                Based on 3 Active NFTs
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NFT Tiers Grid */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Select Your NFT Tier
                    </h2>
                    <div className="flex gap-2">
                        <button className="p-2 glass-card rounded hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {nftTiers.map((tier) => (
                        <NFTTierCard key={tier.tier} tier={tier} />
                    ))}
                </div>
            </section>

            {/* Bottom Note */}
            <div className="mt-16 p-6 glass-card rounded-xl flex items-center gap-4">
                <div className="size-12 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold flex-shrink-0">
                    <span className="material-symbols-outlined">info</span>
                </div>
                <div>
                    <h4 className="font-bold">Royalty Calculation Note</h4>
                    <p className="text-sm text-white/50">
                        Rewards are calculated based on the 24-hour volume of the Aether
                        Decentralized Exchange and NFT Marketplace. APY is dynamic and
                        may vary based on total active participants.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NFTRoyalty;
