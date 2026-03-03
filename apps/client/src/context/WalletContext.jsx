import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';

const WalletContext = createContext(null);

const USDT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'; // USDT on Polygon
const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
];

export const WalletProvider = ({ children }) => {
    const { address, isConnected } = useAccount();
    const [usdtBalance, setUsdtBalance] = useState('0.00');
    const [stakedAmount, setStakedAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBalance = useCallback(async () => {
        if (!isConnected || !address || !window.ethereum) {
            setUsdtBalance('0.00');
            return;
        }

        setIsLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, provider);

            const [balance, decimals] = await Promise.all([
                contract.balanceOf(address),
                contract.decimals()
            ]);

            setUsdtBalance(ethers.formatUnits(balance, decimals));
        } catch (error) {
            console.error('Error fetching USDT balance:', error);
        } finally {
            setIsLoading(false);
        }
    }, [address, isConnected]);

    useEffect(() => {
        fetchBalance();
        const interval = setInterval(fetchBalance, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, [fetchBalance]);

    const stakeUSDT = (amount) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error('Invalid amount');
            return false;
        }

        const effectiveBalance = parseFloat(usdtBalance) - stakedAmount;
        if (numAmount > effectiveBalance) {
            toast.error('Insufficient USDT balance');
            return false;
        }

        setStakedAmount(prev => prev + numAmount);
        toast.success(`Successfully staked ${numAmount} USDT`);
        return true;
    };

    const effectiveUsdtBalance = (parseFloat(usdtBalance) - stakedAmount).toFixed(2);

    return (
        <WalletContext.Provider
            value={{
                usdtBalance: effectiveUsdtBalance,
                rawUsdtBalance: usdtBalance,
                stakedAmount,
                isLoading,
                stakeUSDT,
                refreshBalance: fetchBalance
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
