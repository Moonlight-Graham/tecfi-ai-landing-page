import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Dashboard from './components/Dashboard';
import tokenABI from './abi/BrainzyTokenABI.json';

const tokenAddress = "0xDD9d0827Ee76Ae85762DD30976C3883bbC89A0D5";
const presaleAddress = "0xC629ac5900a5B531e268462b8eD17e6eda31d947";
const presaleStartTime = 1744934400; // April 18, 2025 at 00:00 UTC
const presaleDuration = 30 * 24 * 60 * 60; // 30 days in seconds

function App() {
  const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [ethRaised, setEthRaised] = useState('0');
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributing, setContributing] = useState(false);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [showModal, setShowModal] = useState(false);

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

        const raised = await provider.getBalance(presaleAddress);
        setEthRaised(ethers.utils.formatEther(raised));
      } catch (error) {
        console.error("Error during wallet connection:", error);
        alert("Error connecting wallet: " + error.message);
      }
      setLoading(false);
    } else {
      alert("Please install MetaMask to use this dApp.");
    }
  };

  const contributeToPresale = async () => {
    if (!contributionAmount || isNaN(contributionAmount)) return;
    setContributing(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: presaleAddress,
        value: ethers.utils.parseEther(contributionAmount)
      });
      await tx.wait();

      const updated = await provider.getBalance(presaleAddress);
      setEthRaised(ethers.utils.formatEther(updated));
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert('Transaction failed.');
    }
    setContributing(false);
  };

  const claimTokens = () => {
    alert('Token claiming will be available after presale ends.');
  };

  const disconnectWallet = () => {
    setAccount(null);
    setTokenBalance(null);
    setSymbol('');
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  const getCountdown = () => {
    if (!presaleStartTime) return 'Presale countdown not started.';
    const remaining = presaleStartTime - now;
    if (remaining <= 0) return 'Presale is now live!';
    const days = Math.floor(remaining / (24 * 3600));
    const hours = Math.floor((remaining % (24 * 3600)) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="App" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #DFF1F7 0%, #E6EAEB 100%)',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '10px'
    }}>
      {/* 🧠 Wallet Connection Banner */}
      <div style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc' }}>
        <img src="/brainzyai-icon-32x32.svg" alt="Brainzy AI Icon" style={{ width: '48px', height: '48px', marginBottom: '8px' }} />
        <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>Brainzy AI Governance DApp</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          This is the official site of Brainzy AI.
        </p>
        <p style={{ fontWeight: '600', fontSize: '14px', color: '#417ebf', textAlign: 'center' }}>
          AI-Governed.<br />
          DAO Powered.<br />
          50% Rewards.<br />
        </p>
        {!account && (
          <button
            onClick={connectWallet}
            disabled={loading}
            style={{ marginTop: '8px', padding: '10px 20px', fontSize: '14px', backgroundColor: '#417ebf', color: 'white', border: 'none', borderRadius: '4px' }}>
            Connect Wallet
          </button>
        )}
      </div>

      {/* 🔗 Project Links */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a
          href={`https://etherscan.io/address/${tokenAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#417ebf', fontWeight: '600', marginRight: '20px', textDecoration: 'none' }}>
          View Token Contract
        </a>
        <a
          href={`https://etherscan.io/address/${presaleAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#417ebf', fontWeight: '600', marginRight: '20px', textDecoration: 'none' }}>
          View Presale Contract
        </a>
        <a
          href="/whitepaper.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#417ebf', fontWeight: '600', textDecoration: 'none' }}>
          Read Whitepaper
        </a>
      </div>

      {/* 🌐 Project Description */}
      <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <h1 style={{ fontSize: '1.4rem' }}>Powering the Future of AI Finance</h1>
        <p style={{ fontSize: '15px', maxWidth: '90%', margin: '10px auto' }}>
          Brainzy AI is the next-generation platform that lets you participate in decentralized governance, earn rewards, and influence how AI interacts with DeFi.
        </p>
      </div>

      {/* 🚀 Presale Section */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <h2 style={{ color: '#8C1B1A', fontSize: '20px' }}>🚀 Presale Countdown</h2>
        <p style={{ fontSize: '14px' }}>1 ETH = 100,000 BRANI · Max: 15 ETH · Min: 0.05 ETH</p>
        <p style={{ fontWeight: '600', fontSize: '14px', color: '#417ebf' }}>Total ETH Raised: {ethRaised} ETH</p>
        <p style={{ fontSize: '14px', marginBottom: '4px' }}>⏳ Countdown: {getCountdown()}</p>

        <input
          type="number"
          placeholder="Enter ETH amount"
          value={contributionAmount}
          onChange={(e) => setContributionAmount(e.target.value)}
          style={{ padding: '10px', marginTop: '10px', width: '220px', fontSize: '14px' }}
        /><br />

        <button
          onClick={contributeToPresale}
          disabled={contributing}
          style={{ marginTop: '12px', padding: '10px 25px', fontSize: '14px', backgroundColor: '#417ebf', color: 'white', border: 'none', borderRadius: '6px' }}>
          {contributing ? 'Processing...' : 'Buy $BRANI'}
        </button>

        <div style={{ marginTop: '18px' }}>
          <button
            onClick={claimTokens}
            style={{ padding: '10px 20px', fontSize: '14px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '6px' }}>
            Claim $BRANI (Disabled until end)
          </button>
        </div>
      </div>

      {showModal && (
        <div style={{ background: 'white', border: '1px solid #ccc', padding: '20px', marginTop: '18px', borderRadius: '8px', maxWidth: '90%', margin: '20px auto' }}>
          <h3>✅ Success!</h3>
          <p>Your contribution has been received.</p>
          <button onClick={() => setShowModal(false)} style={{ padding: '6px 12px', backgroundColor: '#417ebf', border: 'none', borderRadius: '6px', color: 'white' }}>Close</button>
        </div>
      )}

      {/* 🧑‍💼 Meet the Team Section */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h3 style={{ fontSize: '22px', color: '#333', marginBottom: '16px' }}>Meet the Team</h3>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '240px', textAlign: 'center' }}>
            <img src="/ryan-putz.jpg" alt="Ryan R. Putz" style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }} />
            <h4 style={{ margin: '12px 0 4px', fontSize: '18px', color: '#1a1a1a' }}>Ryan R. Putz</h4>
            <p style={{ fontSize: '14px', color: '#555', fontStyle: 'italic' }}>Creator & Developer</p>
            <p style={{ fontSize: '14px', color: '#444', marginTop: '8px' }}>
              Licensed Attorney turned full-time Web3 and AI developer; building DeFi ecosystems that incorporate his passion for a future of decentralized, AI-powered finance.
            </p>
          </div>
        </div>
      </div>

      {/* 📊 Optional Dashboard Section */}
      {account && (
        <div style={{ marginTop: '20px' }}>
          <Dashboard account={account} balance={tokenBalance} symbol={symbol} />
        </div>
      )}

      {/* 🌐 Social Links */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a
          href="https://x.com/BrainzyAI"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#1DA1F2',
            fontWeight: '600',
            textDecoration: 'none',
            fontSize: '18px',
            marginRight: '25px'
          }}>
          ❌ Follow us on X
        </a>
        <a
          href="https://t.me/brainzyai"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#0088cc',
            fontWeight: '600',
            textDecoration: 'none',
            fontSize: '18px'
          }}>
          📣 Join our Telegram
        </a>
      </div>
    </div>
  );
}

export default App;
