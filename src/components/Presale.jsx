import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import LiveStats from './LiveStats';

const PRESALE_CONTRACT = '0x1D8Ba8577C3012f614695393fcfDa7C308622939'; // your address
const PRESALE_ABI = [
  'function buyTokens() public payable',
  'function getCurrentRate() public view returns (uint256)',
  'function MIN_BUY() public view returns (uint256)',
  'function MAX_BUY() public view returns (uint256)',
  'function PRESALE_CAP() public view returns (uint256)',
  'function totalSold() public view returns (uint256)',
];

export default function Presale() {
  const [wallet, setWallet] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [totalSold, setTotalSold] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const presaleStartTime = 1746487841; // adjust if needed
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWallet(address);

        const contract = new ethers.Contract(PRESALE_CONTRACT, PRESALE_ABI, signer);
        const sold = await contract.totalSold();
        setTotalSold(parseFloat(ethers.utils.formatEther(sold)));
      } catch (err) {
        console.error('Wallet Connection Error:', err);
        alert(`Connection failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const fetchEthPrice = async () => {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await res.json();
      setTokenPrice(data.ethereum.usd);
    } catch (err) {
      console.error('Error fetching ETH price:', err);
    }
  };

  const contributeToPresale = async () => {
    if (!contributionAmount || isNaN(contributionAmount)) return;
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(PRESALE_CONTRACT, PRESALE_ABI, signer);

      const tx = await contract.buyTokens({
        value: ethers.utils.parseEther(contributionAmount),
      });

      await tx.wait();

      setStatus({ message: '✅ Contribution successful!', type: 'success' });
      setShowModal(true);
    } catch (err) {
      console.error('Contribution Error:', err);
      setStatus({ message: '❌ Contribution failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

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
    fetchEthPrice();
    const timer = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#0a0f2c', borderRadius: '1rem', margin: '20px auto', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#38bdf8', marginBottom: '12px' }}>🚀 $XNAPZ Presale</h2>
      <p style={{ fontSize: '16.5px', fontWeight: '500', color: '#d1d5db', marginBottom: '20px' }}>⏰ Presale Launch Countdown:</p>
      <p style={{ fontSize: '18px', color: '#facc15' }}>{getCountdown()}</p>
      <p style={{ fontSize: '15px', fontWeight: '500', color: '#f472b6', marginBottom: '16px' }}>
        📈 Price Increases Weekly – 5 Phases<br />
        💸 Early Supporters Get the Best Rate!
      </p>

      {tokenPrice && (
        <div style={{ backgroundColor: '#fef2c0', border: '1px solid #facc15', borderRadius: '8px', padding: '10px', margin: '10px auto', fontWeight: '500' }}>
          💰 Live ETH Price: ${tokenPrice.toFixed(2)} USD <br />
          🪙 150,000 XNAPZ = 1 ETH (Week 1) <br />
          📉 1 XNAPZ ≈ ${(tokenPrice / 150000).toFixed(6)} USD
        </div>
      )}

      {!wallet ? (
        <button onClick={connectWallet} style={{ padding: '12px 30px', fontSize: '16px', fontWeight: '600', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', marginTop: '20px', cursor: 'pointer' }}>
          🔌 Connect Wallet
        </button>
      ) : (
        <>
          <div style={{ marginTop: '20px', marginBottom: '20px', color: '#6ee7b7' }}>Connected: {wallet}</div>
          <input
            type="number"
            placeholder="Enter ETH amount"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
            style={{ padding: '10px', width: '100%', maxWidth: '300px', marginBottom: '10px' }}
          />
          {contributionAmount && !isNaN(contributionAmount) && (
            <p style={{ marginBottom: '10px' }}>🧠 You'll receive: <strong>{(parseFloat(contributionAmount) * 150000).toLocaleString()}</strong> XNAPZ</p>
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
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? 'Processing...' : '💸 Buy $XNAPZ'}
          </button>
        </>
      )}

      <LiveStats ethRaised={totalSold} />

      {showModal && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ecfccb', border: '1px solid #4ade80', borderRadius: '8px', color: '#166534' }}>
          🌟 Contribution received!
        </div>
      )}
    </div>
  );
}

