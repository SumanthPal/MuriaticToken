"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TokenAbi from '../abis/Token.json';
import StakingAbi from '../abis/Staking.json';


interface Web3ContextType {
    account: string | null;
    provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null;
    signer: ethers.Signer | null;
    tokenContract: ethers.Contract | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    isConnected: boolean;
    stakingContract: ethers.Contract | null;
}

const Web3Context = createContext<Web3ContextType>({    
    account: null,
    provider: null,
    signer: null,
    tokenContract: null,
    connect: async () => {},
    disconnect: () => {},
    isConnected: false,
    stakingContract: null,
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode}> = ({ children}) => {
    const [account, setAccount] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [provider, setProvider] = useState<ethers.BrowserProvider | ethers.JsonRpcProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
    const [stakingContract, setStakingContract] = useState<ethers.Contract | null>(null);


    const connect = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                const ethProvider = new ethers.BrowserProvider(window.ethereum);
                const ethSigner = await ethProvider.getSigner();
                
                setProvider(ethProvider);
                setSigner(ethSigner);
                setAccount(accounts[0]);
                setIsConnected(true);
                console.log('Connected to account:', accounts[0]);

                const tokenAddress = "0x47470b9a7b5D6f4f306D751dCf3632f4f37B9d44";
                const token = new ethers.Contract(tokenAddress, TokenAbi['abi'], ethSigner);
                setTokenContract(token);

                const stakingAddress = "0xF680fEFf333C21704eD17E90EaD0549E849bBD8E"
                const staking = new ethers.Contract(stakingAddress, StakingAbi['abi'], ethSigner);
                console.log('Token Contract:', token);
                console.log('Staking Contract:', staking);

                setStakingContract(staking);

            } catch (error) {
                console.error("Error connecting to wallet:", error);
                alert("Error connecting to wallet!");
            } 
        } else {
            try {
                // Use Hardhat local network if no wallet is found
                const ethProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
                const ethSigner = await ethProvider.getSigner(); // Uses first local account
                const accounts = await ethProvider.listAccounts();
                
                setProvider(ethProvider);
                setSigner(ethSigner);
                setAccount(accounts[0]);
                setIsConnected(true);
                console.log('Connected to local account:', accounts[0]);
                
                // TODO: Add Token Contract Address
                const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
                const token = new ethers.Contract(tokenAddress, TokenAbi['abi'], ethSigner);
                console.log('Token Contract:', token);
                setTokenContract(token);

                const stakingAddress = "0x0b306bf915c4d645ff596e518faf3f9669b97016"
                const staking = new ethers.Contract(stakingAddress, StakingAbi['abi'], ethSigner);
                console.log('Staking Contract:', staking);

                setStakingContract(staking);
            } catch (error) {
                console.error("Error connecting to local network:", error);
                alert('Could not connect to local network. Please install MetaMask or another Ethereum Wallet.');
            } 
        }
    };

    const disconnect = () => {
        setAccount(null);
        setIsConnected(false);
        setProvider(null);
        setSigner(null);
        setTokenContract(null);
        setStakingContract(null);

    };

    return (
        <Web3Context.Provider value={{
            account,
            connect,
            disconnect,
            isConnected,
            provider,
            signer,
            tokenContract,
            stakingContract,
        }}>
            {children}
        </Web3Context.Provider>
    );
};