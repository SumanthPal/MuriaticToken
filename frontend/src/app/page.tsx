import Head from 'next/head';
import { Web3Provider } from '../context/Web3Context';
import ConnectButton from '../components/ConnectButton';
import TokenInfo from '@/components/TokenInfo';
import TransferForm from '../components/TransferForm';
import StakingPanel from '@/components/StakingPanel';

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
            <Head>
                <title>Muriatic Token Dashboard</title>
                <meta name="description" content="ERC-20 Token Frontend" />
            </Head>

            <Web3Provider>
                <main className="w-full max-w-3xl p-6 bg-white/10 backdrop-blur-md shadow-xl rounded-2xl border border-white/10">
                    <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                        Muriatic Token Dashboard
                    </h1>
                    
                    {/* Connect Button */}
                    <div className="flex justify-center mb-6">
                        <ConnectButton />
                    </div>

                    {/* Token Info */}
                    <div className="mb-6">
                        <TokenInfo />
                    </div>

                    {/* Transfer Form */}
                    <div className="mb-6">
                        <TransferForm />
                    </div>

                    {/* Staking Panel */}
                    <div className="mb-6">
                        <StakingPanel />
                    </div>
                </main>
            </Web3Provider>
        </div>
    );
}
