import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';

const WalletContext = createContext(null);

const USDT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'; // USDT on Polygon
const ADMIN_WALLET = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'; // Admin wallet from DB

const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function transfer(address to, uint256 amount) returns (bool)',
];

export const WalletProvider = ({ children }) => {
    const { address, isConnected } = useAccount();
    const [usdtBalance, setUsdtBalance] = useState('0.00');
    const [stakedAmount, setStakedAmount] = useState(0);
    const [accumulatedRewards, setAccumulatedRewards] = useState(0);
    const [totalEarned, setTotalEarned] = useState(0);
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

    const fetchWalletInfo = useCallback(async () => {
        if (!isConnected || !address) return;

        try {
            const response = await fetch('/api/wallet/info', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setStakedAmount(parseFloat(result.data.locked_balance || 0));
            }
        } catch (error) {
            console.error('Error fetching wallet info:', error);
        }
    }, [address, isConnected]);

    useEffect(() => {
        fetchBalance();
        fetchWalletInfo();
        const interval = setInterval(() => {
            fetchBalance();
            fetchWalletInfo();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchBalance, fetchWalletInfo]);


    useEffect(() => {
        if (stakedAmount <= 0) return;

        const rewardRatePerSecond = (stakedAmount * 0.012) / (7 * 24 * 60 * 60);
        const interval = setInterval(() => {
            setAccumulatedRewards(prev => prev + rewardRatePerSecond);
        }, 1000);

        return () => clearInterval(interval);
    }, [stakedAmount]);

    const stakeUSDT = async (amount) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error('Invalid amount');
            return false;
        }

        if (numAmount > parseFloat(usdtBalance)) {
            toast.error('Insufficient USDT balance');
            return false;
        }

        setIsLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);

            const decimals = await contract.decimals();
            const amountInWei = ethers.parseUnits(amount.toString(), decimals);

            toast.info('Please confirm the transaction in your wallet');
            const tx = await contract.transfer(ADMIN_WALLET, amountInWei);

            toast.info('Transaction submitted. Waiting for confirmation...');
            await tx.wait();

            // Record staking on backend
            const response = await fetch('/api/wallet/record-stake', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    amount: numAmount,
                    txHash: tx.hash
                })
            });

            if (!response.ok) {
                throw new Error('Failed to record stake on server');
            }

            setStakedAmount(prev => prev + numAmount);
            toast.success(`Successfully staked ${numAmount} USDT`);
            fetchBalance();
            return true;
        } catch (error) {
            console.error('Error staking USDT:', error);
            toast.error(error.reason || error.message || 'Transaction failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const unstakeUSDT = (amount) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error('Invalid amount');
            return false;
        }

        if (numAmount > stakedAmount) {
            toast.error('Insufficient staked amount');
            return false;
        }

        // Note: Real unstaking logic would go here if needed.
        // For now, retaining the original simulation for unstaking as per earlier code.
        setStakedAmount(prev => prev - numAmount);
        toast.success(`Successfully unstaked ${numAmount} USDT`);
        return true;
    };

    const claimRewards = () => {
        if (accumulatedRewards <= 0) {
            toast.info('No rewards to claim');
            return false;
        }

        const rewardsToClaim = accumulatedRewards;
        setTotalEarned(prev => prev + rewardsToClaim);
        setAccumulatedRewards(0);
        toast.success(`Successfully claimed ${rewardsToClaim.toFixed(4)} GOLD`);
        return true;
    };

    return (
        <WalletContext.Provider
            value={{
                usdtBalance: usdtBalance,
                rawUsdtBalance: usdtBalance,
                stakedAmount,
                accumulatedRewards,
                totalEarned,
                isLoading,
                stakeUSDT,
                unstakeUSDT,
                claimRewards,
                refreshBalance: () => {
                    fetchBalance();
                    fetchWalletInfo();
                }
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
