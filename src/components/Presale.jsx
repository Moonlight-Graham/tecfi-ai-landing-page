import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import presaleABI from '../abi/PresaleContractABI.json';
import tokenABI from '../abi/BrainzyTokenABI.json';

const PRESALE_ADDRESS = '0x93e0ce76D6CA06B6Bb6AEd1bd586F1Bc64dB623d';

export default function Presale() {
  // your hooks + logic here...
const [account, setAccount] = useState(null);
const [tokenBalance, setTokenBalance] = useState(null);
const [symbol, setSymbol] = useState('');
const [ethPrice, setEthPrice] = useState(null);
const [ethRaised, setEthRaised] = useState('0');
const [presaleContract, setPresaleContract] = useState(null);
const [contributionAmount, setContributionAmount] = useState('');
const [contributing, setContributing] = useState(false);
const [showModal, setShowModal] = useState(false);
const [now, setNow] = useState(Math.floor(Date.now() / 1000));

const presaleStartTime = 1746057600; // May 1, 2025 at 00:00 GMT

const getCountdown = () => {
  const remaining = presaleStartTime - now;
  if (remaining <= 0) return 'LIVE';
  const days = Math.floor(remaining / (24 * 3600));
  const hours = Math.floor((remaining % (24 * 3600)) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);

      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        '0xDD9d0827Ee76Ae85762DD30976C3883bbC89A0D5', // your token
        tokenABI,
        signer
      );
      const presaleInstance = new ethers.Contract(
        '0x93e0ce76D6CA06B6Bb6AEd1bd586F1Bc64dB623d',
        presaleABI,
        signer
      );
      setPresaleContract(presaleInstance);

      const balance = await tokenContract.balanceOf(accounts[0]);
      const tokenSymbol = await tokenContract.symbol();
      setTokenBalance(ethers.utils.formatUnits(balance, 6));
      setSymbol(tokenSymbol);

      const raised = await provider.getBalance('0x93e0ce76D6CA06B6Bb6AEd1bd586F1Bc64dB623d');
      setEthRaised(ethers.utils.formatEther(raised));
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  } else {
    alert("Please install MetaMask.");
  }
};
const disconnectWallet = () => {
  setAccount(null);
  setTokenBalance(null);
  setSymbol('');
  setPresaleContract(null);
};
const contributeToPresale = async () => {
  if (!contributionAmount || isNaN(contributionAmount) || !presaleContract) return;
  setContributing(true);
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to: '0x93e0ce76D6CA06B6Bb6AEd1bd586F1Bc64dB623d',
      value: ethers.utils.parseEther(contributionAmount)
    });
    await tx.wait();

    const updated = await provider.getBalance('0x93e0ce76D6CA06B6Bb6AEd1bd586F1Bc64dB623d');
    setEthRaised(ethers.utils.formatEther(updated));
    setShowModal(true);
  } catch (err) {
    console.error(err);
    alert('Transaction failed.');
  }
  setContributing(false);
};
const claimTokens = async () => {
  if (!presaleContract) return;
  try {
    const tx = await presaleContract.claimTokens();
    await tx.wait();
    alert('Tokens claimed successfully!');
  } catch (error) {
    console.error("Claim failed:", error);
    alert('Claiming failed. Are you eligible?');
  }
};
const fetchEthPrice = async () => {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await res.json();
    setEthPrice(data.ethereum.usd);
  } catch (err) {
    console.error("Error fetching ETH price:", err);
  }
};
useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) connectWallet();
    fetchEthPrice();
    const priceInterval = setInterval(fetchEthPrice, 60000);
    const timeInterval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => {
      clearInterval(priceInterval);
      clearInterval(timeInterval);
    };
	const [walletAddress, setWalletAddress] = useState('');
    const validateWalletAddress = (addr) => ethers.utils.isAddress(addr);
  }, []);
  
  return (
    <>
	
<div style={{
  backgroundColor: '#E6FBFD',
  padding: '20px 20px',
  borderRadius: '5px',
  maxWidth: '100%',
  margin: '0px auto',
  textAlign: 'center'
}}>
  <h2 style={{
    fontWeight: '500',
    fontSize: '22px',
    color: '222',
	textAlign: 'center',
    marginTop: '10px',
	marginBottom: '12px'
  }}>
  <strong>🎉 Brainzy AI Presale 🎉</strong>
  </h2>
<p style={{
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: '600',
  marginTop: '15px',
  color: '#222'
}}>
  ⏳ <strong>Presale Launch Countdown:</strong>
  <br /><strong>{getCountdown()}</strong>
</p>
<p style={{ fontSize: '15px', color: '#9ea834', fontWeight: '500', textAlign: 'center' }}>
  💸 Price Increases Every Week for 5 Weeks.
  <br />Early Adopters Reap the Biggest Rewards!
  <br />Buy Before Listing!
</p>
{/* 💸 LIVE ETH PRICE TICKER */}
{ethPrice && (
  <div style={{
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    padding: '10px 15px',
    borderRadius: '8px',
    textAlign: 'center',
    margin: '20px auto',
    maxWidth: '300px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  }}>
    🟢 Live ETH Price: <strong>${ethPrice.toFixed(2)}</strong> USD
  </div>
)}

  <p style={{ fontSize: '16px', marginBottom: '10px', textAlign: 'center' }}>
    <strong>May 1 through May 7 (Week 1)</strong><br />
  💰 1 ETH = 150,000 BRANI<br />
  🪙 1 BRANI ≈ ${ethPrice ? (ethPrice / 150000).toFixed(6) : '...'} USD
  </p>

  {!account ? (
    <button
      onClick={connectWallet}
      style={{
        padding: '10px 25px',
        fontSize: '16px',
        backgroundColor: '#417ebf',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        marginTop: '8px',
        marginBottom: '8px',
		cursor: 'pointer'
      }}
    >
      🔗 Connect Wallet
    </button>
  ) : (
    <>
	<div style={{ marginTop: '15px', color: '#333' }}>
        <p><strong>Connected:</strong> {account}</p>
        <p><strong>Your Balance:</strong> {tokenBalance} {symbol}</p>
      </div>
      <p><strong>Connected:</strong> {account}</p>
      <p><strong>Your Balance:</strong> {tokenBalance} {symbol}</p>

      <input
        type="number"
        placeholder="Enter ETH amount"
        value={contributionAmount}
        onChange={(e) => setContributionAmount(e.target.value)}
        style={{
          padding: '10px',
          marginBottom: '10px',
          width: '100%',
          maxWidth: '300px'
        }}
      />
	  {contributionAmount && !isNaN(contributionAmount) && (
  <p style={{ fontSize: '15px', marginTop: '5px', color: '#333' }}>
    💸 You’ll receive: <strong>{(parseFloat(contributionAmount) * 125000).toLocaleString()}</strong> BRANI
  </p>
)}

      <br />
      <button
        onClick={contributeToPresale}
        disabled={contributing}
        style={{
          padding: '10px 25px',
          fontSize: '16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          marginTop: '10px',
          marginBottom: '6px',
		  cursor: 'pointer'
        }}
      >
        {contributing ? '⏳ Processing...' : '💸 Buy $BRANI'}
      </button>

      <br />
      <button
        onClick={claimTokens}
        style={{
          padding: '10px 25px',
          fontSize: '14px',
          backgroundColor: '#888',
          color: 'white',
          border: '1px solid #ff4d4f',
          borderRadius: '6px',
          marginTop: '10px',
          marginBottom: '6px',
		  cursor: 'pointer'
        }}
      >
        🎁 Claim $BRANI (after presale ends)
      </button>

      <br />
      <button
        onClick={disconnectWallet}
        style={{
          padding: '8px 16px',
          fontSize: '13px',
          backgroundColor: 'transparent',
          color: '#ff4d4f',
          border: '1px solid #ff4d4f',
          borderRadius: '6px',
          marginTop: '10px',
          cursor: 'pointer'
        }}
      >
        ❌ Disconnect Wallet
      </button>
    </>
  )}

  {showModal && (
    <div style={{
      marginTop: '20px',
      padding: '10px',
      backgroundColor: '#e6ffed',
      border: '1px solid #52c41a',
      borderRadius: '10px',
      color: '#135200'
    }}>
      <h3>✅ Success!</h3>
      <p>Your contribution has been received.</p>
    </div>
 );
}