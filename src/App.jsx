import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Dashboard from './components/Dashboard';
import tokenABI from './abi/TecFiTokenABI';

const tokenAddress = "0x08642a9555AdfBCB03023E30802a64261b4eBE7b";

function App() {
  const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, tokenABI, signer);

        const balance = await contract.balanceOf(accounts[0]);
        const tokenSymbol = await contract.symbol();

        setTokenBalance(ethers.utils.formatUnits(balance, 6));
        setSymbol(tokenSymbol);
        setLoading(false);
      } catch (error) {
        console.error("Error during wallet connection:", error);
        alert("Error connecting wallet: " + error.message);
        setLoading(false);
      }
    } else {
      alert("Please install MetaMask to use this dApp.");
    }
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  return (
  <div 
    className="App"
    style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #b7d6de 0%, #dce7e7 100%)',
      fontFamily: 'Segoe UI, sans-serif',
    }}
  >
    {/* 🔷 Wallet Connection Banner */}
    {/* 🔷 Wallet Connection Banner */}
<div
  style={{
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 25px',
    borderBottom: '1px solid #eee',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    borderRadius: '0 0 12px 12px',
    maxWidth: '100%',
    flexWrap: 'wrap',
  }}
>
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    <img
      src="/tecfiai-icon-32x32.svg"
      alt="TecFi AI Icon"
      style={{ width: '48px', height: '48px' }}
    />
    <div>
      <h3 style={{ margin: 0, color: '#666' }}>TecFi AI Governance DApp</h3>
      <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
        This is the official site of TecFi AI.
      </p>
    </div>
  </div>

  {/* 🔌 Wallet Button Area */}
  <div style={{ textAlign: 'right', marginTop: '10px' }}>
    {!account ? (
      <>
        <p style={{ margin: 0, fontSize: '16px', color: '#121213' }}>
          Connect wallet to begin:
        </p>
        <button
          onClick={connectWallet}
          disabled={loading}
          style={{
            marginTop: '8px',
            padding: '10px 20px',
            fontSize: '15px',
            backgroundColor: '#6eb31c',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </>
    ) : (
      <p
        style={{
          fontWeight: 'bold',
          color: '#28a745',
          fontSize: '14px',
        }}
      >
        ✅ {account.substring(0, 6)}...{account.slice(-4)}
      </p>
    )}
  </div>
</div>

    {/* 🧲 Marketing Content Below */}
    <div style={{ marginTop: '40px', textAlign: 'center', color: '#666' }}>
      <h1 style={{ fontSize: '2rem' }}>🚀 Powering the Future of AI Finance</h1>
      <p style={{ fontSize: '18px', maxWidth: '700px', margin: '20px auto' }}>
        TecFi AI is the next-generation platform that lets you participate in decentralized governance,
        earn rewards, and influence how AI interacts with DeFi. Join the movement!
      </p>
    </div>

    {/* Optional Dashboard Section */}
    {account && (
      <div style={{ marginTop: '40px' }}>
        <Dashboard account={account} balance={tokenBalance} symbol={symbol} />
      </div>
    )}
  </div>
);

}

export default App;
