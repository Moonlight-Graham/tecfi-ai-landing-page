// src/components/AirdropClaim.jsx

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Toast from './Toast';

const AIRDROP_CONTRACT = '0x7aed42003CD5Ac4E400D63aC36Eb39c56560A1A1';
const AIRDROP_ABI = [
  'function claim() public',
  'function hasClaimedPhase1(address) public view returns (bool)'
];

const AIRDROP_START = 1745791200 * 1000; // April 27, 2025 (ms)
const AIRDROP_END = 1747771200 * 1000;   // May 20, 2025 (ms)

export default function AirdropClaim() {
  const [wallet, setWallet] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWallet(address);
        setToast({ message: '✅ Wallet Connected', type: 'success' });
      } catch (err) {
        console.error('Wallet connection failed', err);
        setToast({ message: '❌ Wallet Connection Failed', type: 'error' });
      }
    } else {
      alert('MetaMask is required');
    }
  };

  const claimAirdrop = async () => {
    if (!wallet) {
      alert('Connect your wallet first.');
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(AIRDROP_CONTRACT, AIRDROP_ABI, signer);

      const alreadyClaimed = await contract.hasClaimedPhase1(wallet);
      if (alreadyClaimed) {
        setToast({ message: '❌ Already Claimed', type: 'error' });
      } else {
        const tx = await contract.claim();
        await tx.wait();
        setToast({ message: '✅ Successfully claimed!', type: 'success' });
      }
    } catch (err) {
      console.error('Claim failed', err);
      setToast({ message: '❌ Claim Failed', type: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= AIRDROP_END) {
        setIsEnded(true);
        setIsLive(false);
        clearInterval(interval);
      } else if (now >= AIRDROP_START) {
        setIsLive(true);
        setCountdown('');
      } else {
        const diff = AIRDROP_START - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f0f2fa',
      color: '#333',
      borderRadius: '1rem',
      maxWidth: '600px',
      margin: '1rem auto',
      boxShadow: '0 0 10px #223dee55'
    }}>
      <Toast message={toast.message} type={toast.type} />
      <h2>🎁 XNAPZ Airdrop 🎁</h2>
      <p>Mobile users must open inside MetaMask browser to claim.</p>
      <p><strong>500 XNAPZ</strong> per wallet (April 27 — May 20)</p>
      <p><strong>50%</strong> of supply available this airdrop.</p>

      {countdown && !isLive && (
        <p style={{ color: '#facc15', fontWeight: '550' }}>⏳ Starts in: {countdown}</p>
      )}

      {isEnded ? (
        <p style={{ color: '#f87171', fontWeight: '550' }}>🔴 Airdrop Ended</p>
      ) : !wallet ? (
        <button onClick={connectWallet} disabled={loading} style={{
          padding: '12px 30px',
          fontSize: '16px',
          fontWeight: '600',
          backgroundColor: '#273c6d',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          marginTop: '10px',
          marginBottom: '10px',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '300px'
        }}>Connect Wallet</button>
      ) : (
        <button onClick={claimAirdrop} disabled={!isLive || loading} style={{
          padding: '12px 30px',
          fontSize: '16px',
          fontWeight: '600',
          backgroundColor: !isLive || loading ? '#ccc' : '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          marginTop: '10px',
          marginBottom: '10px',
          cursor: !isLive || loading ? 'not-allowed' : 'pointer',
          width: '100%',
          maxWidth: '300px'
        }}>{loading ? 'Claiming...' : 'Claim My Airdrop'}</button>
      )}
    </div>
  );
}