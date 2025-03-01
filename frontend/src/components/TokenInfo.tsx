"use client";
import React from "react";
import { useToken } from "@/hooks/useToken";
import { useWeb3 } from "@/context/Web3Context";

const TokenInfo: React.FC = () => {
    const { balance, symbol, name, isLoading, error } = useToken();
    const { account, isConnected } = useWeb3();

    if (!isConnected) {
        return (
            <div className="p-6 border border-white/10 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
                <h2 className="text-2xl font-semibold text-white mb-3">Token Information</h2>
                <p className="text-gray-300">Connect your wallet to view token information</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-6 border border-white/10 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
                <h2 className="text-2xl font-semibold text-white mb-3">Token Information</h2>
                <p className="text-gray-300">Loading token data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 border border-red-500/50 rounded-2xl bg-red-900/20 backdrop-blur-md shadow-xl">
                <h2 className="text-2xl font-semibold text-white mb-3">Token Information</h2>
                <p className="text-red-400">Error: {error}</p>
                <p className="mt-2 text-gray-300">Please check that:</p>
                <ul className="list-disc pl-5 mt-1 text-gray-300">
                    <li>The token contract is deployed at the specified address</li>
                    <li>The token implements the ERC20 standard</li>
                    <li>You're connected to the correct network</li>
                </ul>
            </div>
        );
    }

    return (
        <div className="p-6 border border-white/10 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-4">
                Token Information
            </h2>
            <div className="space-y-4 text-gray-300">
                <p><span className="font-semibold text-white">Name:</span> {name}</p>
                <p><span className="font-semibold text-white">Symbol:</span> {symbol}</p>
                <p>
                    <span className="font-semibold text-white">Your Balance:</span> 
                    <span className="text-purple-400 font-medium"> {balance} {symbol}</span>
                </p>
                <p className="text-sm text-gray-400 mt-4">
                    Account: {account?.substring(0, 6)}...{account?.substring(account!.length - 4)}
                </p>
            </div>
        </div>
    );
};

export default TokenInfo;
