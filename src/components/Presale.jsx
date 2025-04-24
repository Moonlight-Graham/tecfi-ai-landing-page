import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import tokenABI from './abi/XynapzCoinABI.json';
import presaleABI from './abi/XynapzPresaleABI.json';

const tokenAddress = '0x72608ECBDfd2516F6Fe1d9341A9019C4305E0BA8';
const presaleAddress = '0x1D8Ba8577C3012f614695393fcfDa7C308622939';
const presaleStartTime = 1746464400;

const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [ethRaised, setEthRaised] = useState('0');
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributing, setContributing] = useState(false);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [showModal, setShowModal] = useState(false);
  const [presaleContract, setPresaleContract] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);

        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        const presaleInstance = new ethers.Contract(presaleAddress, presaleABI, signer);

        const balance = await tokenContract.balanceOf(accounts[0]);
        const tokenSymbol = await tokenContract.symbol();

        setTokenBalance(ethers.utils.formatUnits(balance, 6));
        setSymbol(tokenSymbol);
        setPresaleContract(presaleInstance);

        const raised = await provider.getBalance(presaleAddress);
        setEthRaised(ethers.utils.formatEther(raised));
      } catch (error) {
        console.error("Error during wallet connection:", error);
        alert("Error connecting wallet: " + error.message);
      }
      setLoading(false);
    } else {
      alert("Please install MetaMask to use this dApp.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setTokenBalance(null);
    setSymbol('');
    setPresaleContract(null);
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

  const contributeToPresale = async () => {
    if (!contributionAmount || isNaN(contributionAmount) || !presaleContract) return;
    setContributing(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: presaleAddress,
        value: ethers.utils.parseEther(contributionAmount)
      });
      await tx.wait();

      const updated = await provider.getBalance(presaleAddress);
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
      console.error('Claim failed:', error);
      alert("Claiming failed. Are you eligible?");
    }
  };

  const getCountdown = () => {
    const remaining = presaleStartTime - now;
    if (remaining <= 0) return 'LIVE';
    const days = Math.floor(remaining / (24 * 3600));
    const hours = Math.floor((remaining % (24 * 3600)) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
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
  
function Presale() {
  
 return (

         <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#0f172a',
          color: 'fff',
          borderRadius: '12px',
          maxWidth: '750px',
          marginTop: '20px',
          marginBottom: '20px',
          margin: '2rem auto',
          boxShadow: '0 0 10px #22d3ee55'
        }}>
        <h2 style={{
         fontSize: '28px',
         fontWeight: '700',
         color: '#38bdf8',
         marginBottom: '12px'
        }}>
        🚀 Brainzy AI Presale 
        </h2>
   
  <p style={{
    fontSize: '16.5px',
    fontWeight: '500',
    marginBottom: '20px',
    color: '#d1d5db'
  }}>
    🎯 Presale Launch Countdown:<br />
    <strong style={{ fontSize: '18px', color: '#facc15' }}>{getCountdown()}</strong>
  </p>

  <p style={{
    fontSize: '15px',
    fontWeight: '500',
    color: '#f472b6',
    marginBottom: '16px'
  }}>
    🥇 Price Increases Weekly · 5 Phases<br />
       Early Supporters Get the Best Rate!
  </p>

  {ethPrice && (
    <div style={{
      backgroundColor: '#EFF4F2',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '8px 20px',
      fontSize: '16px',
      fontWeight: '500',
      marginBottom: '10px'
    }}>
      🟢 Live ETH Price: ${ethPrice.toFixed(2)} USD
    </div>
  )}

  <p style={{ fontSize: '15px', color: '#cbd5e1', marginBottom: '12px' }}>
    💹 1 ETH = 150,000 BRANI (Week 1)<br />
    1 BRANI ≈ ${ethPrice ? (ethPrice / 150000).toFixed(6) : '...'} USD
  </p>

  {!account ? (
    <button
      onClick={connectWallet}
      style={{
        padding: '10px 25px',
        fontSize: '16px',
		fontWeight: '500',
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
	<div style={{ marginTop: '15px', color: '#EDF4D8' }}>
      <p>Connected: {account}</p>
	  </div>
      <p>Your Balance: {tokenBalance} {symbol}</p>

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
	 )}
	 
{/* LIVE STATS SECTION */}
<div style={{
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '#FAFBFC',
  borderRadius: '1rem',
  maxWidth: '600px',
  margin: '2rem auto',
  boxShadow: '0 0 10px #22d3ee55'
}}>
  <h3 style={{ marginBottom: '10px', color: '#222' }}>📈 Live Presale Stats</h3>
  
  <p style={{ fontSize: '16px', marginBottom: '8px' }}>
    <strong>Total ETH Raised:</strong> {parseFloat(ethRaised).toFixed(2)} ETH
  </p>
  <p style={{ fontSize: '16px', marginBottom: '8px' }}>
    <strong>BRANI Tokens Sold:</strong> {(parseFloat(ethRaised) * 150000).toLocaleString()} BRANI
  </p>
  <p style={{ fontSize: '16px', marginBottom: '12px' }}>
    <strong>Presale Target:</strong> 350 ETH
	</p>
</div>
 );     
}

export default Presale;