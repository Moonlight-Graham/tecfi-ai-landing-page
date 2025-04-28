import { useState } from 'react';
import { ethers } from 'ethers';
import Toast from './Toast';  // Assuming you have a Toast component for notifications

const AIRDROP_CONTRACT = '0x7aed42003CD5Ac4E400D63aC36Eb39c56560A1A1'; // Contract address
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

    // Connect wallet function
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

    // Claim tokens function
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
                    gasLimit: 300000,  // Increase gas limit if needed
                    gasPrice: ethers.utils.parseUnits('30', 'gwei')  // Set gas price
                });
                await tx.wait();  // Wait for the transaction to be mined
                setToast({ message: '✅ Successfully claimed Phase 1!', type: 'success' });
            } else if (phase === 2) {
                alreadyClaimed = await contract.hasClaimedPhase2(wallet);
                if (alreadyClaimed) {
                    setToast({ message: '❌ Already Claimed Phase 2', type: 'error' });
                    setLoading(false);
                    return;
                }
                const tx = await contract.claimPhase2({
                    gasLimit: 300000,  // Increase gas limit if needed
                    gasPrice: ethers.utils.parseUnits('30', 'gwei')  // Set gas price
                });
                await tx.wait();  // Wait for the transaction to be mined
                setToast({ message: '✅ Successfully claimed Phase 2!', type: 'success' });
            }
            triggerConfetti(); // Optional: trigger confetti animation
        } catch (err) {
            console.error('Claim failed', err);
            setToast({ message: '❌ Claim Failed', type: 'error' });
        }
        setLoading(false);
    };

    // Trigger confetti after successful claim
    const triggerConfetti = () => {
        const duration = 1 * 1000; // 1 second
        const end = Date.now() + duration;

        (function frame() {
            const timeLeft = end - Date.now();
            if (timeLeft < 0) return;
            const colors = ['#ade80', '#fac51', '#f87171', '#60a5fa'];
            const particleCount = 5 * (timeLeft / duration);
            confetti({
                particleCount,
                angle: 60,
                spread: 100,
                origin: { x: 0 },
                colors
            });
            confetti({
                particleCount,
                angle: 120,
                spread: 100,
                origin: { x: 1 },
                colors
            });
            requestAnimationFrame(frame);
        })();
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fef2fa', color: '#000000', borderRadius: '1rem', maxWidth: '600px', margin: '1rem auto', boxShadow: '0 0 10px #223dee55' }}>
            <Toast message={toast.message} type={toast.type} />
            <h2>🎁 XNAPZ Airdrop 🎁</h2>
            <p>Mobile users must open the browser INSIDE their MetaMask app to claim.</p>
            <p>Claim <strong>500 XNAPZ</strong> per wallet<br />Available: Now</p>
            <p>Only <strong>50%</strong> of Airdrop Supply is available this Airdrop.</p>
            
            {!wallet ? (
                <button onClick={connectWallet} disabled={connecting} style={{ padding: '12px 30px', fontSize: '16px', fontWeight: '600', backgroundColor: connecting ? '#ccc' : '#273c6d', color: 'white', border: 'none', borderRadius: '10px', marginTop: '10px', cursor: connecting ? 'not-allowed' : 'pointer', width: '100%', maxWidth: '300px' }}>
                    {connecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
            ) : (
                <div>
                    <button onClick={() => claimTokens(1)} disabled={loading} style={{ padding: '12px 30px', fontSize: '16px', fontWeight: '600', backgroundColor: (loading) ? '#ccc' : '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', marginTop: '10px', cursor: (loading) ? 'not-allowed' : 'pointer', width: '100%', maxWidth: '300px' }}>
                        {loading ? 'Claiming...' : 'Claim Phase 1'}
                    </button>
                    <button onClick={() => claimTokens(2)} disabled={loading} style={{ padding: '12px 30px', fontSize: '16px', fontWeight: '600', backgroundColor: (loading) ? '#ccc' : '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', marginTop: '10px', cursor: (loading) ? 'not-allowed' : 'pointer', width: '100%', maxWidth: '300px' }}>
                        {loading ? 'Claiming...' : 'Claim Phase 2'}
                    </button>
                </div>
            )}
        </div>
    );
}
