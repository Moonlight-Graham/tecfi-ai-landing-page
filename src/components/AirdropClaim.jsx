import { useState } from 'react';
import { ethers } from 'ethers';

const AIRDROP_CONTRACT = '0xb8977b6342856353d047e2f54330fd04c2dfd28c';

const AIRDROP_ABI = [
  'function claim() public',
  'function claimed(address) public view returns (bool)',
  'function startTime() public view returns (uint256)',
  'function endTime() public view returns (uint256)'
];

export default function AirdropClaim() {
  const [status, setStatus] = useState('');
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is required');
      return;
    }

    try {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWallet(account);
    } catch (err) {
      setStatus('Wallet connection failed');
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
        setStatus('❌ You’ve already claimed your BRANI.');
      } else {
        const tx = await contract.claim();
        await tx.wait();
        setStatus('✅ Successfully claimed 500 BRANI!');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Claim failed. You may not be eligible or claim window is closed.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#0f172a', color: '#fff', borderRadius: '1rem', maxWidth: '600px', margin: '2rem auto', boxShadow: '0 0 10px #22d3ee55' }}>
      <h2>🎁 BRANI Airdrop</h2>
      <p>Claim 500 BRANI per wallet<br />(Available: April 21 – May 30)</p>

      {!wallet ? (
        <button onClick={connectWallet}>🔗 Connect Wallet</button>
      ) : (
        <button onClick={claimTokens} disabled={loading}>
          {loading ? 'Claiming...' : 'Claim My Airdrop'}
        </button>
      )}

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
}
