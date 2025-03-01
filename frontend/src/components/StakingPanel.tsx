"use client";
import React, { useState, useEffect } from 'react';
import { useStaking } from '../hooks/useStaking';
import { useToken } from '../hooks/useToken';
import { useWeb3 } from '@/context/Web3Context';

const StakingPanel: React.FC = () => {
  const { balance, symbol } = useToken();
  const { stakedBalance, rewards, stake, unstake, claimRewards, isLoading } = useStaking();
  const { isConnected } = useWeb3();
  
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [unstakeAmount, setUnstakeAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [txPending, setTxPending] = useState<boolean>(false);
  const [displayLoading, setDisplayLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setDisplayLoading(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setDisplayLoading(false);
    }
  }, [isLoading]);
  
  const formatNumber = (value: string) => {
    return parseFloat(value || '0').toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;

    setTxPending(true);
    try {
      await stake(stakeAmount);
      setMessage('Staking successful!');
      setMessageType('success');
    } catch (error) {
      setMessage('Staking failed. Please try again.');
      setMessageType('error');
    } finally {
      setTxPending(false);
      setStakeAmount('');
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return;

    setTxPending(true);
    try {
      await unstake(unstakeAmount);
      setMessage('Unstaking successful!');
      setMessageType('success');
    } catch (error) {
      setMessage('Unstaking failed. Please try again.');
      setMessageType('error');
    } finally {
      setTxPending(false);
      setUnstakeAmount('');
    }
  };

  const handleClaimRewards = async () => {
    if (parseFloat(rewards) <= 0) return;

    setTxPending(true);
    try {
      await claimRewards();
      setMessage('Rewards claimed successfully!');
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to claim rewards. Please try again.');
      setMessageType('error');
    } finally {
      setTxPending(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 border border-white/10 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-3">Staking Dashboard</h2>
        <p className="text-gray-300">Connect your wallet to view staking information</p>
      </div>
    );
  }

  if (isLoading && displayLoading) {
    return (
      <div className="p-6 border border-white/10 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-3">Staking Dashboard</h2>
        <p className="text-gray-300">Loading staking data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 border border-white/10 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-6">
        Staking Dashboard
      </h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-md">
        <div className="text-center">
          <h3 className="font-medium text-gray-300">Available</h3>
          <p className="font-bold text-lg text-purple-400">{formatNumber(balance)} {symbol}</p>
        </div>
        <div className="text-center">
          <h3 className="font-medium text-gray-300">Staked</h3>
          <p className="font-bold text-lg text-purple-400">{formatNumber(stakedBalance)} {symbol}</p>
        </div>
        <div className="text-center">
          <h3 className="font-medium text-gray-300">Rewards</h3>
          <p className="font-bold text-lg text-purple-400">{formatNumber(rewards)} {symbol}</p>
        </div>
      </div>
      
      <div className="mb-6 p-4 border border-white/10 rounded-md">
        <h3 className="text-lg font-semibold mb-3 text-white">Stake Tokens</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="0.0"
            className="w-full p-2 border border-white/10 bg-white/5 text-white rounded"
            disabled={txPending}
          />
          <button
            onClick={() => setStakeAmount(balance)}
            className="px-3 py-2 bg-white/10 text-white rounded hover:bg-white/20"
            disabled={txPending || parseFloat(balance) <= 0}
          >
            Max
          </button>
          <button
            onClick={handleStake}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-purple-300"
            disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || txPending}
          >
            Stake
          </button>
        </div>
      </div>
      
      <div className="mb-6 p-4 border border-white/10 rounded-md">
        <h3 className="text-lg font-semibold mb-3 text-white">Unstake Tokens</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={unstakeAmount}
            onChange={(e) => setUnstakeAmount(e.target.value)}
            placeholder="0.0"
            className="w-full p-2 border border-white/10 bg-white/5 text-white rounded"
            disabled={txPending}
          />
          <button
            onClick={() => setUnstakeAmount(stakedBalance)}
            className="px-3 py-2 bg-white/10 text-white rounded hover:bg-white/20"
            disabled={txPending || parseFloat(stakedBalance) <= 0}
          >
            Max
          </button>
          <button
            onClick={handleUnstake}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
            disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0 || txPending}
          >
            Unstake
          </button>
        </div>
      </div>
      
      <div className="mb-6 text-center">
        <button
          onClick={handleClaimRewards}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 w-full"
          disabled={parseFloat(rewards) <= 0 || txPending}
        >
          {`Claim ${formatNumber(rewards)} ${symbol} Rewards`}
        </button>
      </div>
      
      {message && (
        <div 
          className={`p-3 rounded-md text-center ${
            messageType === 'success' ? 'bg-green-800/20 text-green-400' : 
            messageType === 'error' ? 'bg-red-800/20 text-red-400' : 
            'bg-blue-800/20 text-blue-400'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default StakingPanel;