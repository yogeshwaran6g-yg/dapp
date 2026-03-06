import React from 'react';

const StatusBadge = ({ status }) => {
    if (status === 'Completed') {
        return (
            <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20">
                Completed
            </span>
        );
    }
    if (status === 'Failed') {
        return (
            <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20">
                Failed
            </span>
        );
    }
    return (
        <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold border border-yellow-500/20">
            Pending
        </span>
    );
};

export default StatusBadge;
