import React from 'react';

const TokenIcon = ({ icon, iconStyle, iconClass, size = 'w-6 h-6', textSize = 'text-[14px]' }) => (
    <div
        className={`${size} rounded-full flex items-center justify-center`}
        style={iconStyle}
    >
        <span className={`material-symbols-outlined ${textSize} ${iconClass} font-bold`}>{icon}</span>
    </div>
);

export default TokenIcon;
