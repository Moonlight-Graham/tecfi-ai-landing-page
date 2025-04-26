import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const AIRDROP_CONTRACT = '0x7aee42003CD5Ac44D0063aC36Eb39c56560A1A1A'; // <-- your contract
const AIRDROP_ABI = [
  'function claim() public',
  'function claimed(address) public view returns (bool)'
];

// Fixed times (milliseconds)
const AIRDROP_START = 1745791200 * 1000; // April 27, 2025
const AIRDROP_END = 1747771200 * 1000;   // May 20, 2025

export default function AirdropClaim() {
  const [status, setStatus] = useState('');
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false); // NEW
  const [countdown, setCountdown] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const connectWallet = async () => {
  if (!window.ethereum) {
    alert('MetaMask is required');
    return;
  }

  setConnecting(true); // move it here
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts returned.');
    }

    console.log('Connected account:', accounts[0]);
    setWallet(accounts[0]);
    setStatus('✅ Wallet connected');
    setConnecting(false); // ✅ move INSIDE try
  } catch (err) {
    console.error('Wallet connection failed', err);
    setStatus('❌ Wallet connection failed');
    setConnecting(false); // ✅ move INSIDE catch
  }
};

  const claimTokens = async () => {
    if (!wallet) {
      alert('Connect your wallet first.');
      return;
    }

    setLoading(true);
    setStatus('🟰 Claiming tokens...');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(AIRDROP_CONTRACT, AIRDROP_ABI, signer);

      const alreadyClaimed = await contract.claimed(wallet);
      if (alreadyClaimed) {
        setStatus('❌ You already claimed.');
      } else {
        const tx = await contract.claim();
        await tx.wait();
        setStatus('✅ Successfully claimed 500 XNAPZ!');
      }
    } catch (err) {
      console.error('Claim failed', err);
      setStatus('❌ Claim failed. Please try again.');
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
      const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
      const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

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
      boxShadow: '0 0 10px #223dee55'
    }}>
      <h2>🎁 XNAPZ Airdrop</h2>
      <p>Claim 500 XNAPZ per wallet<br />(Available: April 27 – May 20)</p>
      <p>Only 50% of Airdrop Supply is available this Airdrop.</p>

      {countdown && !isLive && (
        <p style={{ color: '#facc15', fontWeight: '550' }}>⏳ Airdrop opens in: {countdown}</p>
      )}
      {isEnded && (
        <p style={{ color: '#f87171', fontWeight: '550' }}>🔴 Airdrop has ended.</p>
      )}

      {/* BUTTONS */}
      {!wallet ? (
        <button
          onClick={connectWallet}
          disabled={connecting}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: connecting ? '#ccc' : 'white',
            color: '#273c6d',
            border: 'none',
            borderRadius: '10px',
            marginTop: '10px',
            marginBottom: '10px',
            cursor: connecting ? 'not-allowed' : 'pointer',
            width: '100%',
            maxWidth: '300px',
          }}
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <button
          onClick={claimTokens}
          disabled={loading || !isLive || isEnded}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: (loading || !isLive || isEnded) ? '#ccc' : '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            marginTop: '10px',
            marginBottom: '10px',
            cursor: (loading || !isLive || isEnded) ? 'not-allowed' : 'pointer',
            width: '100%',
            maxWidth: '300px',
          }}
        >
          {loading ? 'Claiming...' : isLive ? 'Claim My Airdrop' : 'Not Yet Available'}
        </button>
      )}

      {/* STATUS */}
      {status && (
        <p style={{ marginTop: '1rem', fontWeight: '500' }}>{status}</p>
      )}
    </div>
  );
}
