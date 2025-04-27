import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Toast from './Toast';

const AIRDROP_CONTRACT = '0x7aed42003CD5Ac4E400D63aC36Eb39c56560A1A1';
';
const AIRDROP_ABI = [
  'function claimPhase1() public',
  'function hasClaimedPhase1(address) public view returns (bool)'
];

const AIRDROP_START = 1745791200 * 1000; // Start time in ms
const AIRDROP_END = 1747771200 * 1000; // End time in ms

export default function AirdropClaim() {
  const [status, setStatus] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is required');
      return;
    }
    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) throw new Error('No accounts found');
      setWallet(accounts[0]);
      setToast({ message: '✅ Wallet Connected', type: 'success' });
    } catch (err) {
      console.error('Wallet connection failed', err);
      setToast({ message: '❌ Wallet Connection Failed', type: 'error' });
    }
    setConnecting(false);
  };

  const claimTokens = async () => {
    if (!wallet) {
      alert('Connect your wallet first.');
      return;
    }
    setLoading(true);
    setStatus('');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(AIRDROP_CONTRACT, AIRDROP_ABI, signer);

      const alreadyClaimed = await contract.hasClaimedPhase1(wallet);
      if (alreadyClaimed) {
        setToast({ message: '❌ Already Claimed', type: 'error' });
      } else {
        const tx = await contract.claimPhase1();
        await tx.wait();
        setToast({ message: '✅ Successfully claimed!', type: 'success' });
        triggerConfetti();
      }
    } catch (err) {
      console.error('Claim failed', err);
      setToast({ message: '❌ Claim Failed', type: 'error' });
    }
    setLoading(false);
  };

  const triggerConfetti = () => {
    const duration = 1 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) return;
      const colors = ['#4ade80', '#facc15', '#f87171', '#60a5fa'];
      const particleCount = 5 * (timeLeft / duration);
      confetti({
        particleCount,
        angle: 60,
        spread: 100,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount,
        angle: 120,
        spread: 100,
        origin: { x: 1 },
        colors,
      });
      requestAnimationFrame(frame);
    })();
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
      backgroundColor: '#f0f2fa',
      color: '#273c6d',
      borderRadius: '1rem',
      maxWidth: '600px',
      margin: '1rem auto',
      boxShadow: '0 0 10px #223dee55'
    }}>
      <Toast message={toast.message} type={toast.type} />
      <h2>🎁 XNAPZ Airdrop 🎁</h2>
      <p>Mobile users must open the browser INSIDE their MetaMask app to claim.</p>
      <p>Claim <strong>500 XNAPZ</strong> per wallet<br />(Available: April 27 — May 20)</p>
      <p>Only <strong>50%</strong> of Airdrop Supply is available this Airdrop.</p>
      {countdown && !isLive && (
        <p style={{ color: '#facc15', fontWeight: '550' }}>⏳ Airdrop opens in: {countdown}</p>
      )}
      {isEnded && (
        <p style={{ color: '#f87171', fontWeight: '550' }}>🔴 Airdrop has ended.</p>
      )}
      {!wallet ? (
        <button onClick={connectWallet} disabled={connecting} style={{
          padding: '12px 30px',
          fontSize: '16px',
          fontWeight: '600',
          backgroundColor: connecting ? '#ccc' : '#273c6d',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          marginTop: '10px',
          marginBottom: '10px',
          cursor: connecting ? 'not-allowed' : 'pointer',
          width: '100%',
          maxWidth: '300px'
        }}>{connecting ? 'Connecting...' : 'Connect Wallet'}</button>
      ) : (
        <button onClick={claimTokens} disabled={loading || !isLive || isEnded} style={{
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
          maxWidth: '300px'
        }}>{loading ? 'Claiming...' : isLive ? 'Claim My Airdrop' : 'Not Yet Available'}</button>
      )}
    </div>
  );
}
