import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Dashboard from './components/Dashboard';
import tokenABI from './abi/BrainzyTokenABI.json';
import presaleABI from './abi/PresaleContractABI.json';

// Smart contract addresses
const tokenAddress = '0xDD9d0827Ee76Ae85762DD30976C3883bbC89A0D5';
const presaleAddress = '0x6C29ac5980da5B531b268462b8eD17e6edA31D94';
const stakingAddress = '0xF1A5df39FBDf23459ad1cb6D2633F857C2bAebfa';
const presaleStartTime = 1745989200; // April 30, 2025 00:00 GMT

function App() {
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
  }, []);

  return (
    <>
      <div className="App" style={{
        minHeight: '.1vh',
        padding: '0vw',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Segoe UI, sans-serif',
      }}>
        {/* You already had header, presale UI, contract links, wallet logic, and countdown here */}
        {/* ... all that content ... */}
      </div>
<div style={{
  backgroundColor: '#E0F0D0',
  padding: '0px',
  borderRadius: '0px',
  maxWidth: '600px',
  margin: '20px auto',
  textAlign: 'center'
}}>
{/* HEADER */}
<div style={{
  backgroundColor: 'white',
  padding: '0px',
  borderBottom: '.5px solid #ccc',
  textAlign: 'center',
  maxWidth: '100%',
  wordWrap: 'break-word',
  margin: '0px',
  width: '100%'
}}>
  <img
    src="/brainzyai-icon-32x32.svg"
    alt="Brainzy AI Icon"
    style={{
      width: '48px',
      height: '48px',
      marginBottom: '10px'
    }}
  />
  <h2 style={{
    margin: 0,
    fontSize: window.innerWidth < 480 ? '18px' : '28px',
    color: '#111'
  }}>
    Brainzy AI ($BRANI)
  </h2>

  <p style={{ margin: '4px 0', color: '#666' }}>
    The Official Governance dApp of Brainzy AI
  </p>

  <p style={{
    fontWeight: '600',
    fontSize: '15px',
    color: '#4E2635',
    marginBottom: '14px'
  }}>
    AI-Governed. DAO Powered. 50% Rewards.
  </p>

  {/* Contract Links */}
  <div style={{ marginTop: '10px', marginBottom: '8px' }}>
    <a
      href={`https://etherscan.io/address/${tokenAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#1f00c2',
        fontWeight: '600',
        fontSize: '14px',
        textDecoration: 'none',
        marginRight: '7px'
      }}
    >
      <u>Token Contract</u>
    </a>
    <a
      href={`https://etherscan.io/address/${presaleAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#1f00c2',
        fontWeight: '600',
        fontSize: '14px',
        textDecoration: 'none',
        marginRight: '7px'
      }}
    >
      <u>Presale Contract</u>
    </a>
    <a
      href={`https://etherscan.io/address/${stakingAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#1f00c2',
        fontWeight: '600',
        fontSize: '14px',
        textDecoration: 'none'
      }}
    >
      <u>Staking Contract</u>
    </a>
  </div>
</div>
{/* SOCIAL BOX */}
<div style={{
  backgroundColor: '#CCD8E7',
  padding: '0px',
  textAlign: 'center',
  border: '0px',
  borderRadius: '0px',
  margin: '0px auto',
  maxWidth: '100%',
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
}}>
  <a
    href="https://x.com/BrainzyAI"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'inline-block',
      marginRight: '20px',
      color: '#1f00c2',
      fontWeight: '600',
      textDecoration: 'none',
      fontSize: '16px'
    }}
  >
     X / Twitter
  </a>

  <a
    href="https://t.me/brainzyai"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'inline-block',
      color: '#1f00c2',
      fontWeight: '600',
      textDecoration: 'none',
      fontSize: '16px'
    }}
  >
    💬 Telegram
  </a>
</div>

  <h2>🎉 Brainzy AI Presale 🎉</h2>
<p style={{
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: '600',
  marginTop: '15px',
  color: '#222'
}}>
  ⏳ <strong>Presale Launch Date Coming Soon!!!</strong> 
</p>
  <p style={{ fontSize: '16px', marginBottom: '10px' }}>
  💰 1 ETH = 125,000 BRANI<br />
  🪙 1 BRANI ≈ ${ethPrice ? (ethPrice / 125000).toFixed(6) : '...'} USD
</p>
<p style={{ fontSize: '14px', color: '#CC2361', fontWeight: '600' }}>
  💸 25% Presale Discount – Buy Before Listing!
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
  )}
</div>

<div style={{
  backgroundColor: '#f1f8fe',
  padding: '30px',
  textAlign: 'center',
  borderRadius: '10px',
  marginTop: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}}>

  <h2 style={{ fontSize: '24px', color: '#1a1a1a' }}>Tokenomics</h2>
  
  <p style={{ fontSize: '16px', maxWidth: '900px', margin: '0 auto', lineHeight: '1.6', color: '#444' }}>
    The $BRANI token is designed to be the cornerstone of the Brainzy AI ecosystem. The Total Supply of $BRANI is Five Hundred Million (500,000,000). Here’s the breakdown of how tokens are allocated and utilized:
  </p>

  <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))', gap: '18px' }}>
    <div style={{ backgroundColor: '#e6f7ff', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
      <h4 style={{ fontSize: '20px', color: '#1f00c2' }}>(10%)</h4>
      <p style={{ fontSize: '16px', color: '#444' }}>Airdrop</p>
    </div>
    <div style={{ backgroundColor: '#e6ffed', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
      <h4 style={{ fontSize: '20px', color: '#1f00c2' }}>(20%)</h4>
      <p style={{ fontSize: '16px', color: '#444' }}>DAO Treasury</p>
    </div>
    <div style={{ backgroundColor: '#f6f0ff', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
      <h4 style={{ fontSize: '20px', color: '#1f00c2' }}>(30%)</h4>
      <p style={{ fontSize: '16px', color: '#444' }}>Staking & Rewards</p>
    </div>
    <div style={{ backgroundColor: '#fff7e6', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
      <h4 style={{ fontSize: '20px', color: '#1f00c2' }}>(15%)</h4>
      <p style={{ fontSize: '16px', color: '#444' }}>Liquidity Pool</p>
    </div>
    <div style={{ backgroundColor: '#f3ffe6', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
      <h4 style={{ fontSize: '20px', color: '#1f00c2' }}>(20%)</h4>
      <p style={{ fontSize: '16px', color: '#444' }}>Marketing & Listings</p>
    </div>
    <div style={{ backgroundColor: '#e6f7e6', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
      <h4 style={{ fontSize: '20px', color: '#1f00c2' }}>(5%)</h4>
      <p style={{ fontSize: '16px', color: '#444' }}>Creator Rewards</p>
    </div>
  </div>

</div>

      {/* ABOUT SECTION */}
      <div style={{ backgroundColor: '#f5faff', padding: '30px', textAlign: 'center', marginTop: '4px' }}>
        <img 
          src="/brainzyai-icon-32x32.svg"  
          alt="Brainzy AI Icon" 
          style={{ width: '48px', height: '48px', marginTop: '10px', marginBottom: '10px', maxWidth: '100%' }} 
        />
        <h2 style={{ fontSize: '28px', marginBottom: '15px', color: '#222' }}>About Brainzy AI</h2>
        <p style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto 15px', lineHeight: '1.6', color: '#444', textAlign: 'justify' }}>
          <strong>Brainzy AI ($BRANI)</strong> is a governance-driven DeFi token built on Ethereum.  It is designed to merge the power of Artificial Intelligence ("AI") with Decentralized Finance ("DeFi").  BRANI empowers token holders to guide the evolution of AI development through transparent, off-chain DAO processes. 
        </p>
        <img 
          src="/brainzyai-icon-32x32.svg" 
          alt="Brainzy AI Icon" 
          style={{ width: '48px', height: '48px', marginTop: '20px', marginBottom: '10px', maxWidth: '100%' }} 
        />
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#222' }}>Token Holders Vote, AI Decides</h2>
        <p style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto 15px', lineHeight: '1.6', color: '#444', textAlign: 'justify' }}>
          BRANI rewards participation and transparency. Twenty Percent (20%) of the token supply goes to a DAO Treasury locked in a Safe Wallet. Token holders get to create proposals and vote on which proposals should be submitted to AI for decision. AI decides based on a "Token Holder Best Interest" algorithm, and AI provides a reasoning statment for the decision. This "Best Interest" algorithm will continually get stronger and refined as AI is able to collect and analyze the data from the results of prior implemented decisions. This is what truly makes BRANI unique, token holders truly get to help shape the future of the Brainzy AI ecosystem and AI DeFi.
        </p>
        <p style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', color: '#444' }}>
          BRANI is founded by <a href="https://www.linkedin.com/in/brainzytoken" target="_blank" rel="noopener noreferrer" style={{ color: '#1f00c2', fontWeight: '600', textDecoration: 'none' }}>Ryan R. Putz</a>, a licensed attorney and Web3 developer.
        </p>
        <p style={{ fontSize: '18px', marginTop: '20px', color: '#1f00c2' }}>
          <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#1f00c2', fontWeight: '600', textDecoration: 'none' }}>
            📄 <u>Read the Whitepaper</u>
          </a>
        </p>
      </div>

      {/* MEET THE CREATOR SECTION */}
<div style={{
  backgroundColor: '#E5ECF2',
  padding: '20px 20px',
  textAlign: 'center',
  marginTop: '20px'
}}>
  <img 
    src="/brainzyai-icon-32x32.svg" 
    alt="Brainzy AI Icon" 
    style={{ width: '48px', height: '48px', marginBottom: '15px' }} 
  />

  <h2 style={{ fontSize: '24px', color: '#1a1a1a', marginBottom: '8px' }}>
    👨‍💻 Meet the Creator & Developer
  </h2>

  <h3 style={{ fontSize: '20px', color: '#222', marginBottom: '8px' }}>
    Ryan R. Putz
  </h3>

  <p style={{
    fontSize: '16px',
    maxWidth: '800px',
    margin: '0 auto 20px',
    lineHeight: '1.6',
    color: '#444',
    textAlign: 'justify'
  }}>
    Ryan is a licensed attorney turned full-time Web3 and AI developer. With a background in law and a passion for DeFi, 
    he brings legal expertise and technical innovation to the Brainzy AI project. As the sole founder of Brainzy AI, 
    Ryan is fully doxxed and publicly verifiable. His commitment to transparency and ethics sets BRANI apart.
  </p>

  <a 
    href="https://www.linkedin.com/in/brainzytoken" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{
      display: 'inline-block',
      marginTop: '10px',
      color: '#1f00c2',
      fontWeight: '600',
      fontSize: '16px',
      textDecoration: 'none',
      border: '1px solid #1f00c2',
      padding: '8px 16px',
      borderRadius: '6px'
    }}
  >
    🔗 LinkedIn Profile
  </a>
</div>
{/* Contact Footer */}
<footer style={{
  backgroundColor: '#f7f9fc',
  padding: '20px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#555',
  borderTop: '1px solid #e0e0e0',
  marginTop: '40px'
}}>
  <p>
    Built with ❤️ by <strong>Ryan R. Putz</strong> · All Rights Reserved © {new Date().getFullYear()}
  </p>
  <p>
    📬 <a 
      href="mailto:developer@brainzytoken.com" 
      style={{ color: '#1f00c2', textDecoration: 'none', fontWeight: '500' }}
    >
      <u>developer@brainzytoken.com</u>
    </a>
  </p>
</footer>
      <div style={{ textAlign: 'center', margin: '10px 0 20px' }}>
      </div>
    </>
  );
}

export default App;