"use client";
import React from "react";
import { useWeb3 } from "../context/Web3Context";

const ConnectButton: React.FC = () => {
    const { connect, disconnect, isConnected, account } = useWeb3();

    return (
        <div className="flex items-center space-x-4">
            {isConnected ? (
                <div className="flex items-center space-x-2">
                    <p className="text-gray-700">
                        Connected: <span className="font-medium">{account?.substring(0,6)}...{account?.substring(account.length - 4)}</span>
                    </p>
                    <button
                        onClick={disconnect}
                        className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition duration-200"
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                <button
                    onClick={connect}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition duration-200"
                >
                    Connect
                </button>
            )}
        </div>
    );
};

export default ConnectButton;
