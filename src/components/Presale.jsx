import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import LiveStats from './LiveStats';
import Toast from './Toast';

const PRESALE_CONTRACT = '0x1D8Ba8577C3012f614695393fcfDa7C308622939'; // Your presale contract address

const PRESALE_ABI = [
  'function buyTokens() public payable',
  'function getCurrentRate() public view returns (uint256)',
  'function MIN_BUY() public view returns (uint256)',
  'function MAX_BUY() public view returns (uint256)',
  'function PRESALE_CAP() public view returns (uint256)',
  'function totalSold() public view returns (uint256)',
  'function contributions(address) public view returns (uint256)'
];

export default function Presale() {
  const [wallet, setWallet] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [tokenPrice, setTokenPrice] = useState(null);
  const [minBuy, setMinBuy] = useState(0);
  const [maxBuy, setMaxBuy] = useState(0);
  const [cap, setCap] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  const presaleStartTime = 1748041200; // Update this to your desired start time
  const TOKEN_DECIMALS = 1e6;

  // ⏳ Countdown logic
  const getCountdown = () => {
    const remaining = presaleStartTime - now;
    if (remaining <= 0) return 'LIVE!';
    const days = Math.floor(remaining / (3600 * 24));
    const hours = Math.floor((remaining % (3600 * 24)) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    connectWallet();
    fetchEthPrice();
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔌 Connect wallet & read contract data
  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask!');
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWallet(address);

      const contract = new ethers.Contract(PRESALE_CONTRACT, PRESALE_ABI, signer);
      const min = await contract.MIN_BUY();
      const max = await contract.MAX_BUY();
      const cap = await contract.PRESALE_CAP();
      const sold = await contract.totalSold();

      setMinBuy(parseFloat(ethers.utils.formatEther(min)));
      setMaxBuy(parseFloat(ethers.utils.formatEther(max)));
      setCap(parseFloat(ethers.utils.formatUnits(cap, 6)));
      setTotalSold(parseFloat(ethers.utils.formatUnits(sold, 6)));
    } catch (err) {
      console.error(err);
      alert('Wallet connection failed');
    }
    setLoading(false);
  };

  // 🌐 Fetch ETH price
  const fetchEthPrice = async () => {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await res.json();
      setTokenPrice(data.ethereum.usd);
    } catch (err) {
      console.error('Error fetching ETH price:', err);
    }
  };

  // 🧮 Calculate preview amount
  const getXnapzAmount = () => {
    if (!contributionAmount || isNaN(contributionAmount)) return 0;
    const eth = ethers.utils.parseEther(contributionAmount);
    const rate = 150000 * TOKEN_DECIMALS;
    const tokens = eth.mul(rate).div(ethers.utils.parseUnits('1', 6));
    return parseFloat(ethers.utils.formatUnits(tokens, 6));
  };

  // 🪙 Send transaction to contract
  const contributeToPresale = async () => {
    if (!contributionAmount) return;
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(PRESALE_CONTRACT, PRESALE_ABI, signer);

      const tx = await contract.buyTokens({
        value: ethers.utils.parseEther(contributionAmount)
      });

      await tx.wait();
      setStatus({ message: '✅ Contribution successful!', type: 'success' });
      connectWallet(); // refresh values
    } catch (err) {
      console.error('Contribution Error:', err);
      let message = '❌ Contribution failed.';
      if (err.error && err.error.message) {
        if (err.error.message.includes('cap')) message = '❌ Presale cap exceeded.';
        else if (err.error.message.includes('Min')) message = '❌ Minimum is 0.01 ETH.';
      }
      setStatus({ message, type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h2 style={{ color: '#38bdf8' }}>🚀 $XNAPZ Presale</h2>
      <p style={{ fontSize: '16.5px', fontWeight: '500', color: '#d1d5db', marginBottom: '20px' }}>
        🧨 Presale Launch Countdown:<br />
        <strong style={{ fontSize: '18px', color: '#facc15' }}>{getCountdown()}</strong>
      </p>
      <p style={{ fontSize: '15px', fontWeight: '500', color: '#f472b6', marginBottom: '16px' }}>
        🎯 Price Increases Weekly – 5 Phases<br />
        🔥 Early Supporters Get the Best Rate!
      </p>

      {tokenPrice && (
        <div style={{ backgroundColor: '#fef2c0', padding: '10px', borderRadius: '10px', marginBottom: '20px' }}>
          💰 Live ETH Price: ${tokenPrice.toFixed(2)} USD<br />
          🪙 150,000 XNAPZ = 1 ETH (Week 1)<br />
          🧮 1 XNAPZ ≈ ${(tokenPrice / 150000).toFixed(6)} USD<br />
          🧢 Minimum is 0.01 ETH | Maximum is 25 ETH
        </div>
      )}

      {wallet && <p>🔗 Connected: {wallet}</p>}

      <input
        type="number"
        placeholder="Enter ETH amount"
        value={contributionAmount}
        onChange={(e) => setContributionAmount(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
      />

      {getXnapzAmount() > 0 && (
        <p>🧠 You’ll receive: <strong>{getXnapzAmount().toLocaleString()}</strong> XNAPZ</p>
      )}

      <button
        onClick={contributeToPresale}
        disabled={loading}
        style={{
          padding: '10px 25px',
          backgroundColor: '#22c55e',
          color: 'white',
          fontWeight: '600',
          fontSize: '16px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Processing...' : '🚀 Buy $XNAPZ'}
      </button>

      {status.message && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: status.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: status.type === 'success' ? '#065f46' : '#b91c1c'
          }}
        >
          {status.message}
        </div>
      )}

      <LiveStats ethRaised={totalSold} />
    </div>
  );
}
