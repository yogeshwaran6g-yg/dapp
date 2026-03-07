import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { getActiveNetwork } from '../config/networkConfig';
import { api } from '../services/axios';
import { API_ENDPOINTS } from '../utils/endpoints';

const WalletContext = createContext(null);

const activeNetwork = getActiveNetwork();
const USDT_ADDRESS = activeNetwork.usdtAddress;

const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function transfer(address to, uint256 amount) returns (bool)',
];

export const WalletProvider = ({ children }) => {
    const { address, isConnected } = useAccount();
    const [bnbBalance, setBnbBalance] = useState('0.00');
    const [usdtBalance, setUsdtBalance] = useState('0.00');
    const [energyBalance, setEnergyBalance] = useState(0);
    const [ownBalance, setOwnBalance] = useState('0.00');
    const [stakedAmount, setStakedAmount] = useState(0);
    const [accumulatedRewards, setAccumulatedRewards] = useState(0);
    const [totalEarned, setTotalEarned] = useState(0);
    const [stakeHistory, setStakeHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBalance = useCallback(async () => {
        if (!isConnected || !address) {
            setBnbBalance('0.00');
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
            console.error('Error fetching on-chain balance:', error);
        } finally {
            setIsLoading(false);
        }
    }, [address, isConnected]);

    const fetchWalletInfo = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const result = await api.get(API_ENDPOINTS.WALLET.INFO, {}, {
                showErrorToast: false // Don't show toast for background refreshes
            });

            if (result.success && result.data) {
                const rawBalance = result.data.own_token;
                setOwnBalance(parseFloat(rawBalance || 0).toString());
                setEnergyBalance(parseFloat(result.data.energy_balance || 0));
                setStakedAmount(parseFloat(result.data.locked_balance || 0));
            } else {
                console.warn('[WalletContext] fetchWalletInfo: API returned failure or no data', result);
            }
        } catch (error) {
            console.error('Error fetching wallet info:', error);
        }
    }, [address, isConnected]);

    const fetchStakeHistory = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!isConnected || !address || !token) return;

        try {
            const result = await api.get(API_ENDPOINTS.WALLET.STAKE_HISTORY, {}, {
                showErrorToast: false
            });
            if (result.success) {
                setStakeHistory(result.data);
            }
        } catch (error) {
            console.error('Error fetching stake history:', error);
        }
    }, [address, isConnected]);

    useEffect(() => {
        fetchBalance();
        fetchWalletInfo();
        fetchStakeHistory();
        const interval = setInterval(() => {
            fetchBalance();
            fetchWalletInfo();
            fetchStakeHistory();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchBalance, fetchWalletInfo, fetchStakeHistory]);

    useEffect(() => {
        if (stakedAmount <= 0) return;

        const rewardRatePerSecond = (stakedAmount * 0.012) / (7 * 24 * 60 * 60);
        const interval = setInterval(() => {
            setAccumulatedRewards(prev => prev + rewardRatePerSecond);
        }, 1000);

        return () => clearInterval(interval);
    }, [stakedAmount]);

    const stakeOwnToken = async (amount) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error('Invalid amount');
            return false;
        }

        const currentBalance = parseFloat(ownBalance) || 0;
        if (numAmount > currentBalance) {
            toast.error(`Insufficient token balance (have ${currentBalance}, need ${numAmount})`);
            return false;
        }

        setIsLoading(true);
        try {
            const result = await api.post(API_ENDPOINTS.WALLET.STAKE_INTERNAL, { amount: numAmount }, {
                showSuccessToast: true
            });

            if (result.status === 200) {
                setStakedAmount(prev => prev + numAmount);
                setOwnBalance(prev => (parseFloat(prev) - numAmount).toString());
                fetchWalletInfo();
                fetchStakeHistory();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error staking tokens:', error);
            // Error toast is already shown by axios interceptor unless showErrorToast is false
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const claimRewards = async () => {
        if (accumulatedRewards <= 0) {
            toast.info('No rewards to claim');
            return false;
        }

        setIsLoading(true);
        try {
            const rewardsToClaim = accumulatedRewards;
            const result = await api.post(API_ENDPOINTS.WALLET.CLAIM_REWARDS, {
                amount: rewardsToClaim
            }, {
                showSuccessToast: true
            });

            if (result.status !== 200 && !result.success) {
                throw new Error(result.message || 'Failed to claim rewards on server');
            }

            setTotalEarned(prev => prev + rewardsToClaim);
            setAccumulatedRewards(0);
            fetchWalletInfo();
            fetchStakeHistory();
            return true;
        } catch (error) {
            console.error('Error claiming rewards:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WalletContext.Provider
            value={{
                bnbBalance,
                usdtBalance,
                energyBalance,
                ownBalance,
                stakedAmount,
                accumulatedRewards,
                totalEarned,
                stakeHistory,
                isLoading,
                stakeOwnToken,
                claimRewards,
                refreshBalance: () => {
                    fetchBalance();
                    fetchWalletInfo();
                    fetchStakeHistory();
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