import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Dashboard from './components/Dashboard';
import tokenABI from './abi/BrainzyTokenABI.json';

const tokenAddress = "0xDD9d0827Ee76Ae85762DD30976C3883bbC89A0D5";
const presaleAddress = "0x6C29ac5980da5B531b268462b8eD17e6edA31D94";
const presaleStartTime = null; // Set actual UNIX timestamp when you launch
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
        setLoading(false);

        const raised = await provider.getBalance(presaleAddress);
        setEthRaised(ethers.utils.formatEther(raised));
      } catch (error) {
        console.error("Error during wallet connection:", error);
        alert("Error connecting wallet: " + error.message);
        setLoading(false);
      }
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
    const remaining = presaleStartTime + presaleDuration - now;
    if (remaining <= 0) return 'Presale has ended.';
    const days = Math.floor(remaining / (24 * 3600));
    const hours = Math.floor((remaining % (24 * 3600)) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div
      className="App"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #D1FCC4 0%, #E9EDEC 100%)',
        fontFamily: 'Segoe UI, sans-serif'
      }}
    >
      {/* 🧠 Wallet Connection Banner */}
      <div style={{ backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 25px', borderBottom: '1px solid #eee', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderRadius: '0 0 12px 12px', maxWidth: '100%', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/brainzyai-icon-32x32.svg" alt="Brainzy AI Icon" style={{ width: '64px', height: '64px' }} />
          <div>
            <h3 style={{ margin: 0, color: '#333' }}>Brainzy AI Governance DApp</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              This is the official site of Brainzy AI.<br />
              <span style={{ fontWeight: '600', color: '#417ebf' }}>
                AI-Governed. DAO Powered. 50% Rewards.
              </span>
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          {!account ? (
            <>
              <p style={{ margin: 0, fontSize: '14px', color: '#121213' }}>Connect wallet to begin:</p>
              <button onClick={connectWallet} disabled={loading} style={{ marginTop: '8px', padding: '10px 20px', fontSize: '15px', backgroundColor: '#417ebf', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>{loading ? 'Connecting...' : 'Connect Wallet'}</button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#417ebf', fontSize: '14px' }}>✅ {account.substring(0, 6)}...{account.slice(-4)}</p>
              <button onClick={disconnectWallet} style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: '#417ebf', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>Disconnect</button>
            </div>
          )}
        </div>
      </div>

      {/* 🌍 Project Description */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h1 style={{ fontSize: '2rem' }}>Powering the Future of AI Finance</h1>
        <p style={{ fontSize: '18px', maxWidth: '700px', margin: '20px auto' }}>
          Brainzy AI is the next-generation platform that lets you participate in decentralized governance, earn rewards, and influence how AI interacts with DeFi. Join the movement!
        </p>
      </div>

      {/* 🚀 Presale Section */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h2 style={{ color: '#333', fontSize: '24px' }}>🚀 Presale is LIVE</h2>
        <p style={{ fontSize: '16px' }}>1 ETH = 100,000 BRANI · Max: 15 ETH · Min: 0.05 ETH</p>
        <p style={{ fontWeight: '600', fontSize: '20px', color: '#417ebf' }}>Total ETH Raised: {ethRaised} ETH</p>
        <p style={{ fontSize: '16px', marginBottom: '5px' }}>⏳ Countdown: {getCountdown()}</p>

        <input type="number" placeholder="Enter ETH amount" value={contributionAmount} onChange={(e) => setContributionAmount(e.target.value)} style={{ padding: '10px', marginTop: '10px', width: '220px', fontSize: '16px' }} />
        <br />
        <button onClick={contributeToPresale} disabled={contributing} style={{ marginTop: '12px', padding: '10px 25px', fontSize: '16px', backgroundColor: '#417ebf', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          {contributing ? 'Processing...' : 'Buy BRANI'}
        </button>

        <div style={{ marginTop: '20px' }}>
          <button onClick={claimTokens} style={{ padding: '10px 20px', fontSize: '14px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '6px', cursor: 'not-allowed' }}>
            Claim BRANI Tokens (Disabled until end)
          </button>
        </div>

        {showModal && (
          <div style={{ background: 'white', border: '1px solid #ccc', padding: '20px', marginTop: '20px', borderRadius: '8px', maxWidth: '400px', margin: '20px auto', textAlign: 'center' }}>
            <h3>✅ Success!</h3>
            <p>Your contribution has been received.</p>
            <button onClick={() => setShowModal(false)} style={{ padding: '6px 12px', backgroundColor: '#417ebf', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>Close</button>
          </div>
        )}
      </div>

      {/* 🔗 Etherscan Links */}
      <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px' }}>
        <a href={`https://etherscan.io/address/${tokenAddress}`} target="_blank" rel="noopener noreferrer" style={{ color: '#417ebf', marginRight: '20px' }}>View BRANI Token on Etherscan</a>
        <a href={`https://etherscan.io/address/${presaleAddress}`} target="_blank" rel="noopener noreferrer" style={{ color: '#417ebf' }}>View Presale Contract</a>
      </div>

      {/* 📄 White Paper Link */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#417ebf', fontWeight: '600', textDecoration: 'none', fontSize: '20px' }}>
          📄 Read Our White Paper
        </a>
      </div>

      {account && (
        <div style={{ marginTop: '20px' }}>
          <Dashboard account={account} balance={tokenBalance} symbol={symbol} />
        </div>
      )}
    </div>
  );
}

export default App;
