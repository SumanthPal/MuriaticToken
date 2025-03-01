import Head from 'next/head';
import { Web3Provider } from '../context/Web3Context';
import ConnectButton from '../components/ConnectButton';
import TokenInfo from '@/components/TokenInfo';
import TransferForm from '../components/TransferForm';
import StakingPanel from '@/components/StakingPanel';


export default function Home() {
    return (
      <div>
        <Head>
          <title>Muriatic Token Dashboard</title>
          <meta name="description" content="ERC-20 Token Frontend" />
        </Head>
  
        <Web3Provider>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Muriatic Token Dashboard</h1>
        <ConnectButton />
        <div className="mt-4">
          <TokenInfo />
          
        </div>
        <div>
          <TransferForm />
        </div>
        <div>
          <StakingPanel />
        </div>
      </main>
    </Web3Provider>
      </div>
    );
  }