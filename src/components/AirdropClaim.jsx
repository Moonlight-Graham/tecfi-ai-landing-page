import { useState } from 'react';
import { ethers } from 'ethers';
import Toast from './Toast'; // Assuming you have a Toast component for notifications

const AIRDROP_CONTRACT = '0x7aed42003CD5Ac4E400D63aC36Eb39c56560A1A1'; // Replace with full contract address
const AIRDROP_ABI = [
  'function claimPhase1() public',
  'function claimPhase2() public',
  'function hasClaimedPhase1(address) public view returns (bool)',
  'function hasClaimedPhase2(address) public view returns (bool)',
  'function phase1Claimed() public view returns (uint256)',
  'function phase2Claimed() public view returns (uint256)',
  'function xnapz() public view returns (address)',
  'function owner() public view returns (address)',
  'function transferOwnership(address) public',
  'event AirdropClaimed(address indexed user, uint8 phase)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
];

export default function AirdropClaim() {
  const [status, setStatus] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is required');
      return;
    }
    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) throw new Error('No accounts found');
      setWallet(accounts[0]);
      setToast({ message: '✅ Wallet Connected', type: 'success' });
    } catch (err) {
      console.error('Wallet connection failed', err);
      setToast({ message: '❌ Wallet Connection Failed', type: 'error' });
    }
    setConnecting(false);
  };

  const claimTokens = async (phase) => {
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

      let alreadyClaimed;
      if (phase === 1) {
        alreadyClaimed = await contract.hasClaimedPhase1(wallet);
        if (alreadyClaimed) {
          setToast({ message: '❌ Already Claimed Phase 1', type: 'error' });
          setLoading(false);
          return;
        }
        const tx = await contract.claimPhase1({
          gasLimit: 100000,
          gasPrice: ethers.utils.parseUnits('1.5', 'gwei'),
        });
        await tx.wait();
        setToast({ message: '✅ Successfully claimed Phase 1!', type: 'success' });
      } else if (phase === 2) {
        alreadyClaimed = await contract.hasClaimedPhase2(wallet);
        if (alreadyClaimed) {
          setToast({ message: '❌ Already Claimed Phase 2', type: 'error' });
          setLoading(false);
          return;
        }
        const tx = await contract.claimPhase2({
          gasLimit: 100000,
          gasPrice: ethers.utils.parseUnits('1.5', 'gwei'),
        });
        await tx.wait();
        setToast({ message: '✅ Successfully claimed Phase 2!', type: 'success' });
      }

      triggerConfetti();
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
      if (timeLeft < 0) return;
      const colors = ['#ade8f0', '#fac51f', '#f87171', '#60a5fa'];
      const particleCount = 5 * (timeLeft / duration);
      confetti({ particleCount, angle: 60, spread: 100, origin: { x: 0 }, colors });
      confetti({ particleCount, angle: 120, spread: 100, origin: { x: 1 }, colors });
      requestAnimationFrame(frame);
    })();
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fef2fa', color: '#000000', borderRadius: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
      <Toast message={toast.message} type={toast.type} />
      <h2>🎁 XNAPZ Airdrop 🎁</h2>
      <p>Mobile users must open the browser INSIDE their MetaMask app to claim.</p>
      <p>Claim <strong>500 XNAPZ</strong> per wallet<br />Available: Now</p>
      <p>Only <strong>50%</strong> of total Airdrop Supply is available in Phase 1.</p>

      {!wallet ? (
        <>
          <button onClick={connectWallet} disabled={connecting} style={{ padding: '12px 30px', fontSize: '16px', fontWeight: '600', backgroundColor: connecting ? '#ccc' : '#f6851b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          <div style={{ marginTop: '10px' }}>
            <a href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer" style={{ color: '#f6851b', fontWeight: 'bold' }}>
              Don’t have MetaMask? Install here.
            </a>
          </div>
        </>
      ) : (
        <div>
          <button onClick={() => claimTokens(1)} disabled={loading} style={{ padding: '12px 30px', fontSize: '16px', fontWeight: '600', backgroundColor: loading ? '#ccc' : '#4ade80', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            {loading ? 'Claiming...' : 'Claim Phase 1'}
          </button>
        </div>
      )}
    </div>
  );
}
