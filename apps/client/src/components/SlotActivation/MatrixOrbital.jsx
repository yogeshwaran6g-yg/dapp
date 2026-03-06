import React from 'react';

const MatrixOrbital = ({ level, isActive, user }) => {
    // Determine center content: Profile Image > First Initial > default "U"
    const centerInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';
    const profileImage = user?.profile_image;

    return (
        <div className="relative w-full h-36 flex items-center justify-center overflow-visible my-0.5">
            <svg viewBox="0 0 200 200" className="h-[110%] w-auto relative z-10 overflow-visible">
                <defs>
                    <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FF8C00" />
                        <stop offset="70%" stopColor="#FF4500" />
                        <stop offset="100%" stopColor="#6B1400" />
                    </radialGradient>
                    <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <clipPath id="centerClip">
                        <circle cx="100" cy="100" r="28" />
                    </clipPath>
                </defs>

                {/* Orbit Circles */}
                <circle cx="100" cy="100" r="55" fill="none" stroke="#633b24" strokeWidth="1" opacity="0.6" />
                <circle cx="100" cy="100" r="85" fill="none" stroke="#633b24" strokeWidth="1" opacity="0.4" />

                {/* Central Core */}
                <circle cx="100" cy="100" r="28" fill="url(#coreGradient)" />

                {profileImage ? (
                    <image
                        href={profileImage}
                        x="72" y="72" width="56" height="56"
                        clipPath="url(#centerClip)"
                        preserveAspectRatio="xMidYMid slice"
                    />
                ) : (
                    <text
                        x="100" y="104"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        className="text-[28px] font-display font-black"
                    >{centerInitial}</text>
                )}

                {/* --- INNER ORBIT NODES (r=55) --- */}
                {/* Top Node (White) */}
                <circle cx="100" cy="45" r="7" fill="#ffffff" filter="url(#nodeGlow)" />
                {/* Bottom Left (Green) */}
                <circle cx="52" cy="127" r="7" fill="#00ff88" filter="url(#nodeGlow)" />
                {/* Bottom Right (Yellow) */}
                <circle cx="148" cy="127" r="7" fill="#FFC800" filter="url(#nodeGlow)" />

                {/* --- OUTER ORBIT NODES (r=85) --- */}
                {/* Top-Right Node (White) */}
                <circle cx="160" cy="40" r="7" fill="#ffffff" filter="url(#nodeGlow)" />
                {/* Middle Left Node (Yellow) */}
                <circle cx="20" cy="85" r="7" fill="#FFC800" filter="url(#nodeGlow)" />
                {/* Bottom-Center Node (Orange) */}
                <circle cx="100" cy="185" r="7" fill="#FF8C00" filter="url(#nodeGlow)" />
            </svg>
        </div>
    );
};

export default MatrixOrbital;
