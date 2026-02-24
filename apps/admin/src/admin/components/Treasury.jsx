import React from 'react';
import TreasuryMetrics from './Treasury/TreasuryMetrics';
import TransactionHistory from './Treasury/TransactionHistory';

const Treasury = () => {
    return (
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <TreasuryMetrics />
            <TransactionHistory />
        </div>
    );
};

export default Treasury;
