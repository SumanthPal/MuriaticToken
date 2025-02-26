import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
    account: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    isConnected: boolean;
}

const Web3Context = createContext<Web3ContextType>({
    account: null,
    connect: async () => {},
    disconnect: () => {},
    isConnected: false,
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode}> = ({ children}) => {
    const [account, setAccount] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const connect = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                setIsConnected(true);
                console.log('Connected to account:', accounts[0]);

            } catch (error) {
                console.error('Error connecting to wallet:', error);
            } 
            } else {
                alert('Please install MetaMask! or another Ethereum Wallet');
        }
        
    };

    const disconnect = () => {
        setAccount(null);
        setIsConnected(false);
    }

    return (
        <Web3Context.Provider value={{
            account,
            connect,
            disconnect,
            isConnected
        }}>
            {children}
        </Web3Context.Provider>
    )
}