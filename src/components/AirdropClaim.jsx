import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const AIRDROP_CONTRACT = '0x7aed42003CD5Ac4E400D63aC36Eb39c56560A1A1';

const AIRDROP_ABI = [
  'function claim() public',
  'function claimed(address) public view returns (bool)'
];

// Fixed start and end times (in seconds)
const AIRDROP_START = 1745791200 * 1000; // April 27, 2025 
const AIRDROP_END = 1747771200 * 1000;   // May 20, 2025 

export default function AirdropClaim() {
  const [status, setStatus] = useState('');
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const connectWallet = async () => {
  if (!window.ethereum) {
    alert('MetaMask is required');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setWallet(accounts[0]);
    setStatus('✅ Wallet connected');
  } catch (err) {
    console.error(err);
    setStatus('❌ Wallet connection failed');
  }
};

  const claimTokens = async () => {
    setLoading(true);
    setStatus('');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(AIRDROP_CONTRACT, AIRDROP_ABI, signer);

      const alreadyClaimed = await contract.claimed(wallet);
      if (alreadyClaimed) {
        setStatus('❌ You’ve already claimed your XNAPZ.');
      } else {
        const tx = await contract.claim();
        await tx.wait();
        setStatus('✅ Successfully claimed 500 XNAPZ!');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Claim failed. You may not be eligible or the claim window is closed.');
    }
    setLoading(false);
  };
  
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();

      if (now >= AIRDROP_END) {
        setIsEnded(true);
        setIsLive(false);
        setCountdown('');
        return;
      }

      if (now >= AIRDROP_START) {
        setIsLive(true);
        setCountdown('');
        return;
      }

    const remaining = AIRDROP_START - now;
      const days = Math.floor(remaining / (24 * 1000 * 3600));
	  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remaining / (1000 * 60)) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#0f172a',
      color: '#fff',
      borderRadius: '1rem',
      maxWidth: '600px',
      margin: '2rem auto',
      boxShadow: '0 0 10px #22d3ee55'
    }}>
      <h2>🎁 XNAPZ Airdrop</h2>
      <p>Claim 500 XNAPZ per wallet<br />(Available: April 27 – May 20)</p>
	  <p>Only 50% of Airdrop Supply is available this Airdrop.</p>

      {countdown && !isLive && (
        <p style={{ color: '#facc15', fontWeight: '550' }}>⏳ Airdrop opens in: {countdown}</p>
      )}

      {isEnded && (
        <p style={{ color: '#f87171', fontWeight: '550' }}>⛔ Airdrop has ended.</p>
      )}

      {!wallet ? (
        <button onClick={connectWallet}
		style={{
          padding: '10px 25px',
          fontSize: '15px',
		  fontWeight: '550',
          backgroundColor: 'white',
          color: '#273C6D',
          border: 'none',
          borderRadius: '12px',
          marginTop: '6px',
          marginBottom: '6px',
		  cursor: 'pointer'
      }}
    >
		🔗 Connect Wallet</button>
      ) : (
        <button onClick={claimTokens} disabled={loading || !isLive || isEnded}>
          {loading ? 'Claiming...' : !isLive ? 'Not Yet Available' : 'Claim My Airdrop'}
        </button>
      )}

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
}
