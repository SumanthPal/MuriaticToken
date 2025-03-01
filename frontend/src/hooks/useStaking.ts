import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { useToken } from './useToken';

export const useStaking = () => {
    const {stakingContract, tokenContract, account, isConnected} = useWeb3();
    const { symbol } = useToken();

    const [stakedBalance, setStakedBalance] = useState<string>('0');
    const [rewards, setRewards] = useState<string>('0');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchStakingInfo = async () => {
        if (stakingContract && account) {
            try {
                setIsLoading(true);

                const decimals = await tokenContract?.decimals();
                // Use stakedAmount instead of stakedBalance
                const stakedBalanceResult = await stakingContract.stakedAmount(account);
                // Use calculateRewards instead of earned
                const rewardsResult = await stakingContract.calculateRewards(account);

                setStakedBalance(ethers.formatUnits(stakedBalanceResult, decimals));
                setRewards(ethers.formatUnits(rewardsResult, decimals));

                console.log("Staking info loaded:", { stakedBalance: stakedBalanceResult, rewards: rewardsResult });
            } catch (error) {
                console.error("Error fetching staking info:", error);
                setStakedBalance('0');
                setRewards('0');
            } finally {
                setIsLoading(false);
            } 
        } else {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isConnected) {
            fetchStakingInfo();
        }
    }, [stakingContract, account, isConnected]);

    const stake = async (amount : string): Promise<boolean> => {
        if (!stakingContract || !tokenContract) {
            console.error("Staking contract or token contract not found");
            return false;
        }
        
        try {
            
            const decimals = await tokenContract.decimals();
            const parsedAmount = ethers.parseUnits(amount, decimals);
            console.log(`Approving ${amount} tokens for staking`);
            console.log(`contract ${stakingContract.address}`);
            const approveTx = await tokenContract.approve(stakingContract.getAddress(), parsedAmount);
            await approveTx.wait();

            console.log(`Staking ${amount} tokens`);
            const stakeTx = await stakingContract.stake(parsedAmount);
            await stakeTx.wait();

            console.log("Stake successful");
            await fetchStakingInfo();
            return true;
        } catch (error) {
            console.error("Error staking tokens:", error);
            return false;
        };
    }

    const unstake = async (amount: string): Promise<boolean> => {
        if (!stakingContract) return false;

        try {
            const decimals = await tokenContract?.decimals();
            const parsedAmount = ethers.parseUnits(amount, decimals);

            console.log(`Unstaking ${amount} tokens`);
            const unstakeTx = await stakingContract.unstake(parsedAmount);
            await unstakeTx.wait();

            console.log("Unstake successful");
            await fetchStakingInfo();
            return true;
        } catch (error) {
            console.error("Error unstaking tokens:", error);
            return false;
        }
    }

    const claimRewards = async (): Promise<boolean> => {
        if (!stakingContract) return false;

        try {
            console.log("Claiming rewards");   
            // Use claimRewards instead of getReward
            const tx = await stakingContract.claimRewards();
            await tx.wait();

            console.log("Rewards claimed");
            await fetchStakingInfo();

            return true;
        } catch (error) {
            console.error("Claim rewards error:", error);
            return false;
        }
    } 

    return {
        stakedBalance,
        rewards,
        symbol,
        isLoading,
        stake,
        unstake,
        claimRewards,
        refresh: fetchStakingInfo
    };
};