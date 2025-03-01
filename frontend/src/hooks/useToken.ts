"use client";
import {useState, useEffect} from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';

export const useToken = () => {
    const { tokenContract, account, isConnected } = useWeb3();
    const [balance, setBalance] = useState<string>("0");
    const [symbol, setSymbol] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const transfer = async (to: string, amount: string) => {
        try {
            const decimals = await tokenContract?.decimals();
            const parsedAmount = ethers.parseUnits(amount, decimals);

            console.log(`Transferring ${amount} tokens to ${to}`);
            const tx = await tokenContract?.transfer(to, parsedAmount);

            console.log("Transaction submitted: ", tx.hash);

            await tx.wait();
            console.log("Transaction confirmed: ", tx.hash);

            const newBalance = await tokenContract?.balanceOf(account);
            setBalance(ethers.formatUnits(newBalance, decimals));

            return true;
        } catch (error) {
            console.error("Error transferring tokens:", error);
            return false;
        }
    }

    useEffect(() => {

        const fetchTokenData = async () => {
            if (tokenContract && account) {
                try {
                    setIsLoading(true);

                    const symbolResult = await tokenContract.symbol();
                    const nameResult = await tokenContract.name();
                    const balanceResult = await tokenContract.balanceOf(account);
                    const decimals = await tokenContract.decimals();


                    setSymbol(symbolResult);
                    setName(nameResult);
                    setBalance(ethers.formatUnits(balanceResult, decimals));

                    console.log("Token info loaded:", { name: nameResult, symbol: symbolResult });
                } catch (error) {
                    console.error("Error loading token info:", error);
                } finally {
                    setIsLoading(false);
                }
            }

            };
            const transfer = async (to: string, amount: string) => {
                try {
                    const decimals = await tokenContract?.decimals();
                    const parsedAmount = ethers.parseUnits(amount, decimals);

                    console.log(`Transferring ${amount} tokens to ${to}`);
                    const tx = await tokenContract?.transfer(to, parsedAmount);

                    console.log("Transaction submitted: ", tx.hash);

                    await tx.wait();
                    console.log("Transaction confirmed: ", tx.hash);

                    const newBalance = await tokenContract?.balanceOf(account);
                    setBalance(ethers.formatUnits(newBalance, decimals));

                    return true;
                } catch (error) {
                    console.error("Error transferring tokens:", error);
                    return false;
                }
                


            }
            if (isConnected) {
                fetchTokenData();
              }
            }, [tokenContract, account, isConnected]);
            return {
                balance,
                symbol,
                name,
                isLoading,
                transfer,
              };
        
        
          
        }

    
  