"use client";
import React from 'react';
import { useWeb3 } from '@/context/Web3Context';

const ConnectButton: React.FC = () => {
    const { connect, disconnect, isConnected, account, isLoading, error } = useWeb3();

    return (
        <div className="flex justify-center items-center space-x-4 p-6">
            {isLoading ? (
                <button disabled className="bg-gray-600 text-white py-2 px-6 rounded-lg">Connecting...</button>
            ) : error ? (
                <div className="bg-red-500 text-white py-2 px-6 rounded-lg">Error: {error}</div>
            ) : isConnected ? (
                <div className="flex items-center space-x-2">
                    <p className="text-gray-200">Connected: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}</p>
                    <button onClick={disconnect} className="bg-red-500 text-white py-2 px-6 rounded-lg">Disconnect</button>
                </div>
            ) : (
                <button onClick={connect} className="bg-blue-600 text-white py-2 px-6 rounded-lg">Connect Wallet</button>
            )}
        </div>
    );
};

export default ConnectButton;
