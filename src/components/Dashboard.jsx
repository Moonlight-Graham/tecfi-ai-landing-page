import React, { useState, useEffect } from 'react';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { ethers } from 'ethers';

import TokenBalance from './TokenBalance';
import StakingDashboard from './StakingDashboard';
import ProposalDashboard from './ProposalDashboard';
import HistoryLog from './HistoryLog';

import tokenABI from '../abi/TecFiTokenABI.json';
import '../index.css';

// Ethereum Mainnet token address
const tokenAddress = '0xEc34Fd8C49F0F87266c45e296CDC717c52D7B2e9';

// MetaMask connector
const injected = new InjectedConnector({ supportedChainIds: [1] });

// Provide ethers.js to Web3ReactProvider
function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

function Dashboard() {
  const { activate, deactivate, account, library } = useWeb3React();
  const [tokenBalance, setTokenBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (err) {
      console.error('🛑 Connection Error:', err);
      alert("Failed to connect wallet.");
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    deactivate();
    setTokenBalance(null);
  };

  // Fetch TECFI token balance
  const fetchBalance = async () => {
    if (!library || !account) return;
    try {
      setLoading(true);
      const signer = library.getSigner();
      const contract = new ethers.Contract(tokenAddress, tokenABI, signer);
      const balance = await contract.balanceOf(account);
      const formatted = ethers.utils.formatUnits(balance, 6);
      setTokenBalance(formatted);
      setLoading(false);
    } catch (err) {
      console.error('❌ Failed to fetch balance:', err);
      setTokenBalance("0");
      setLoading(false);
    }
  };

  // Auto-fetch balance when account or library changes
  useEffect(() => {
    if (account && library) {
      fetchBalance();
    }
  }, [account, library]);

  return (
    <div style={styles.wrapper}>
      {!account ? (
        <button onClick={connectWallet} style={styles.connectButton}>
          Connect Wallet
        </button>
      ) : (
        <>
          <h1 style={styles.title}>🌐 TECFI AI DAO Dashboard</h1>
          <p><strong>Wallet:</strong> {account}</p>
          <p><strong>Your TECFI Balance:</strong> {loading ? "Fetching..." : `${tokenBalance} TECFI`}</p>

          <button onClick={disconnectWallet} style={styles.disconnectButton}>
            Disconnect
          </button>

          {/* Subcomponents */}
          <TokenBalance account={account} balance={tokenBalance} />
          <StakingDashboard account={account} />

          <div style={{ marginTop: '2rem' }}>
            <ProposalDashboard account={account} tokenBalance={tokenBalance} />
          </div>

          <div style={{ marginTop: '2rem' }}>
            <HistoryLog />
          </div>
        </>
      )}
    </div>
  );
}

// Main export: App with Web3React context
export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Dashboard />
    </Web3ReactProvider>
  );
}

// 💅 Inline styles (can be moved to CSS or Tailwind)
const styles = {
  wrapper: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  title: {
    marginBottom: '1rem',
    fontSize: '2rem',
    color: '#1e90ff',
  },
  connectButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#1e90ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  disconnectButton: {
    marginTop: '1rem',
    marginBottom: '2rem',
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#eee',
    color: '#111',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
