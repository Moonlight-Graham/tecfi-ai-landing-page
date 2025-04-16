import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Dashboard from './components/Dashboard';
import tokenABI from './abi/BrainzyTokenABI.json';
import presaleABI from './abi/PresaleContractABI.json';

const tokenAddress = "0xDD9d0827Ee76Ae85762DD30976C3883bbC89A0D5";
const presaleAddress = "0x6C29ac5980da5B531b268462b8eD17e6edA31D94";
const presaleStartTime = 1744972800; // April 18, 2025 at 00:00 AM CST

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
  const [presaleContract, setPresaleContract] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const signer = await provider.getSigner();
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        const presaleInstance = new ethers.Contract(presaleAddress, presaleABI, signer);

        const balance = await tokenContract.balanceOf(accounts[0]);
        const tokenSymbol = await tokenContract.symbol();

        setTokenBalance(ethers.utils.formatUnits(balance, 6));
        setSymbol(tokenSymbol);
        setPresaleContract(presaleInstance);

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

  const fetchEthPrice = async () => {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await res.json();
      setEthPrice(data.ethereum.usd);
    } catch (err) {
      console.error("Error fetching ETH price:", err);
    }
  };

  const contributeToPresale = async () => {
    if (!contributionAmount || isNaN(contributionAmount) || !presaleContract) return;
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

  const claimTokens = async () => {
    if (!presaleContract) return;
    try {
      const tx = await presaleContract.claimTokens();
      await tx.wait();
      alert('Tokens claimed successfully!');
    } catch (error) {
      console.error('Claim failed:', error);
      alert('Claiming failed. Are you eligible?');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setTokenBalance(null);
    setSymbol('');
    setPresaleContract(null);
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) connectWallet();
    fetchEthPrice();
    const priceInterval = setInterval(fetchEthPrice, 60000);
    const timeInterval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => {
      clearInterval(priceInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const getCountdown = () => {
    const remaining = presaleStartTime - now;
    if (remaining <= 0) return 'Presale is now live!';
    const days = Math.floor(remaining / (24 * 3600));
    const hours = Math.floor((remaining % (24 * 3600)) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const braniValue = ethPrice ? ethPrice.toFixed(2) : '...';
  const braniValue100k = ethPrice ? (ethPrice).toFixed(2) : '...';

  return (
    <div className="App" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #DFF1F7 0%, #E6EAEB 100%)',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '10px'
    }}>
      <div style={{ backgroundColor: 'white', textAlign: 'center', padding: '20px 10px', borderBottom: '1px solid #ccc' }}>
        <img src="/brainzyai-icon-32x32.svg" alt="Brainzy AI Icon" style={{ width: '48px', height: '48px', marginBottom: '8px' }} />
        <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>Brainzy AI Governance DApp</h3>
        <p style={{ fontSize: '14px', color: '#666' }}>This is the official site of Brainzy AI.</p>
        <p style={{ fontWeight: '600', fontSize: '14px', color: '#417ebf' }}>AI-Governed. <br /> DAO Powered. <br /> 50% Rewards.</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2 style={{ fontSize: '24px', color: '#111' }}>🚀 Powering the Future of AI Finance</h2>
        <p style={{ fontSize: '16px', maxWidth: '700px', margin: '10px auto' }}>
          Brainzy AI is the next-generation platform that lets you participate in decentralized governance, earn rewards, and influence how AI interacts with DeFi.
        </p>
      </div>
{!account && (
  <div style={{ textAlign: 'center', marginTop: '15px' }}>
    <p style={{ margin: 0, fontSize: '14px', color: '#121213' }}>Connect wallet to begin:</p>
    <button
      onClick={connectWallet}
      disabled={loading}
      style={{
        marginTop: '8px',
        padding: '10px 20px',
        fontSize: '15px',
        backgroundColor: '#417ebf',
        color: 'white',
        border: 'none',
        borderRadius: '4px'
      }}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  </div>
)}

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '16px', color: '#333' }}>
        {ethPrice ? (
          <p>
            💰 1 ETH ≈ ${braniValue} USD → 100,000 BRANI ≈ ${braniValue100k} USD<br />📉 1 BRANI ≈ ${(ethPrice / 100000).toFixed(6)} USD
          </p>
        ) : (
          <p>Fetching ETH price...</p>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '18px' }}>
        <h2 style={{ fontSize: '22px', color: '#222' }}>📣 Presale Countdown</h2>
        <p style={{ fontSize: '16px' }}>1 ETH = 100,000 BRANI · Max: 15 ETH · Min: 0.05 ETH</p>
        <p style={{ fontWeight: '600', fontSize: '16px', color: '#417ebf' }}>Total ETH Raised: {ethRaised} ETH</p>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>⏳ Countdown: {getCountdown()}</p>
        <input
          type="number"
          placeholder="Enter ETH amount"
          value={contributionAmount}
          onChange={(e) => setContributionAmount(e.target.value)}
          style={{ padding: '10px', marginBottom: '10px', width: '200px' }}
        />
        <br />
        <button onClick={contributeToPresale} disabled={contributing} style={{ padding: '10px 25px', fontSize: '16px', backgroundColor: '#417ebf', color: 'white', border: 'none', borderRadius: '6px' }}>
          {contributing ? 'Processing...' : 'Buy $BRANI'}
        </button>
        <br />
        <button onClick={claimTokens} style={{ marginTop: '10px', padding: '10px 25px', fontSize: '14px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '6px' }}>
          Claim $BRANI (Disabled until end)
        </button>
      </div>

      {showModal && (
        <div style={{ background: 'white', border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
          <h3>✅ Success!</h3>
          <p>Your contribution has been received.</p>
          <button onClick={() => setShowModal(false)} style={{ padding: '6px 12px', backgroundColor: '#417ebf', border: 'none', borderRadius: '6px', color: 'white' }}>Close</button>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#1f00c2', fontWeight: '600', fontSize: '16px', marginRight: '20px', textDecoration: 'none' }}>📄 Whitepaper</a>
        <a href={`https://etherscan.io/address/${tokenAddress}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1f00c2', fontSize: '16px', textDecoration: 'none', marginRight: '20px' }}>Token Contract</a>
        <a href={`https://etherscan.io/address/${presaleAddress}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1f00c2', fontSize: '16px', textDecoration: 'none' }}>Presale Contract</a>
      </div>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>👤 Meet the Team</h3>
        <img src="/ryan-putz.jpg" alt="Ryan R. Putz" style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
        <h4 style={{ marginTop: '12px', fontSize: '16px', color: '#1a1a1a' }}>Ryan R. Putz</h4>
        <p style={{ fontSize: '14px', fontStyle: 'italic' }}>Creator & Developer</p>
        <p style={{ fontSize: '14px', color: '#444', marginTop: '8px' }}>
          Licensed Attorney turned full-time Web3 and AI developer; building DeFi ecosystems that incorporate his passion for a future of decentralized, AI-powered finance.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <a href="https://x.com/BrainzyAI" target="_blank" rel="noopener noreferrer" style={{ color: '#1DA1F2', fontWeight: '600', textDecoration: 'none', fontSize: '18px', marginRight: '25px' }}>X / Twitter</a>
        <a href="https://t.me/brainzyai" target="_blank" rel="noopener noreferrer" style={{ color: '#0088cc', fontWeight: '600', textDecoration: 'none', fontSize: '18px' }}>Telegram</a>
      </div>
    </div>
  );
}

export default App;
