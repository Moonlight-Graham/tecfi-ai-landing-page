import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Dashboard from './components/Dashboard';
import tokenABI from './abi/BrainzyTokenABI.json';
import presaleABI from './abi/PresaleContractABI.json';
import { SocialIcon } from 'react-social-icons'
import AirdropClaim from './components/AirdropClaim';

// Smart contract addresses
const tokenAddress = '0xDD9d0827Ee76Ae85762DD30976C3883bbC89A0D5';
const presaleAddress = '0x93e0ce76D6CA06B6Bb6AEd1bd586F1Bc64dB623d';
const stakingAddress = '0xF1A5df39FBDf23459ad1cb6D2633F857C2bAebfa';
const presaleStartTime = 1746057600; // May 1, 2025 00:00 GMT

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
	const [walletAddress, setWalletAddress] = useState('');
    const validateWalletAddress = (addr) => ethers.utils.isAddress(addr);
  }, []);

  return (
    <>
      
{/* HEADER */}
<div style={{
  backgroundColor: 'white',
  padding: '5px',
  borderBottom: '.5px solid #ccc',
  textAlign: 'center',
  maxWidth: '100%',
  wordWrap: 'break-word',
  margin: '0px',
  width: '100%'
}}>
{/* 🔥 PRESALE BANNER (scrolling) */}
<div style={{
  backgroundColor: '#4287A9',
  color: 'white',
  padding: '8px 0',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  fontSize: '15px',
  fontWeight: '550',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  position: 'relative'
}}>
  <div style={{
    display: 'inline-block',
    paddingLeft: '100%',
    animation: 'scrollBanner 30s linear infinite'
  }}>
    🚀 Presale Goes Live and Begins on May 1 and Ends on June 5!   ·   Presale price increases every 7 days! ·  Be an Early Adopter and Reap the Biggest Rewards!   ·   Follow on X and join Telegram for Updates!
  </div>

  <style>
    {`
      @keyframes scrollBanner {
        0% { transform: translateX(0); }
        100% { transform: translateX(-100%); }
      }
    `}
  </style>
</div>
  <p style={{ margin: '6px 0', color: '#222' }}>
    The Official Governance dApp of Brainzy AI
  </p>
  <img src="/brainzyai-icon-32x32.png" alt="Brainzy Icon" width={32} height={32} />
  <h2 style={{
    margin: '10px',
    fontSize: '25px',
    color: '#222'
  }}>
    <strong>Brainzy AI</strong>
  </h2>
  <p style={{
    fontWeight: '500',
    fontSize: '16px',
    color: '#9ea834',
    marginTop: '12px',
	marginBottom: '14px'
  }}>
    AI-Governed. DAO Powered. 50% Rewards.
    </p> 
  
</div>

<div style={{
  backgroundColor: '#1f2937',
  padding: '25px',
  borderRadius: '12px',
  textAlign: 'center',
  color: '#fff',
  marginTop: '5px'
}}>
<SocialIcon url="https://x.com/BrainzyAI"
    style={{ height: 32, width: 32, alignment: 'center',  paddingRight: '20px' }} /> 
<SocialIcon url="https://t.me/brainzyai"
    style={{ height: 32, width: 32, alignment: 'center', paddingLeft: '20px' }} />
{/* Contract Links */}
    <h3 style={{
    fontSize: '17px',
    fontWeight: '500',
    marginBottom: '10px'
  }}>
    📄 Verified Contract Links
  </h3>
  
    <a
      href={`https://etherscan.io/address/${tokenAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#80A6DC',
        fontWeight: '500',
        fontSize: '14px',
        textDecoration: 'none',
        marginRight: '8px'
      }}
    >
      <u>Token Contract</u>
    </a>
    <a
      href={`https://etherscan.io/address/${presaleAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#80A6DC',
        fontWeight: '500',
        fontSize: '14px',
        textDecoration: 'none',
        marginRight: '8px'
      }}
    >
      <u>Presale Contract</u>
    </a>
    <a
      href={`https://etherscan.io/address/${stakingAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#80A6DC',
        fontWeight: '500',
        fontSize: '14px',
        textDecoration: 'none'
      }}
    >
      <u>Staking Contract</u>
    </a>
  </div>
 
<div style={{
  backgroundColor: '#0f172a',
  color: '#fff',
  padding: '20px 20px',
  borderRadius: '12px',
  marginTop: '8px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  textAlign: 'center',
  maxWidth: '700px',
  margin: '40px auto'
}}>
  <h2 style={{
    fontSize: '28px',
    fontWeight: '700',
    color: '#38bdf8',
    marginBottom: '12px'
  }}>
    🚀 Brainzy AI Presale 🚀
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
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '12px 20px',
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

      {/* ABOUT SECTION */}
      <div style={{ backgroundColor: '#f5faff', padding: '30px', textAlign: 'center', marginTop: '4px' }}>
        <img 
          src="/brainzyai-icon-32x32.svg"  
          alt="Brainzy AI Icon" 
          style={{ width: '48px', height: '48px', marginTop: '10px', marginBottom: '10px', maxWidth: '100%' }} 
        />
        <h2 style={{ fontSize: '26px', marginBottom: '15px', color: '#222' }}>About Brainzy AI</h2>
        <p style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto 15px', lineHeight: '1.6', color: '#444', textAlign: 'justify' }}>
          <strong>Brainzy AI ($BRANI)</strong> is a governance-driven DeFi token built on Ethereum.  It is designed to merge the power of Artificial Intelligence ("AI") with Decentralized Finance ("DeFi").  BRANI empowers token holders to guide the evolution of AI development through transparent, off-chain DAO processes. 
        </p>
        <img 
          src="/brainzyai-icon-32x32.svg" 
          alt="Brainzy AI Icon" 
          style={{ width: '48px', height: '48px', marginTop: '20px', marginBottom: '10px', maxWidth: '100%' }} 
        />
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#222' }}>Holders Vote, AI Decides</h2>
        <p style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto 15px', lineHeight: '1.6', color: '#444', textAlign: 'justify' }}>
          BRANI rewards participation and transparency. Twenty Percent (20%) of the token supply goes to a DAO Treasury locked in a Safe Wallet. Token holders get to create proposals and vote on which proposals should be submitted to AI for decision. AI decides based on a "Token Holder Best Interest" algorithm, and AI provides a reasoning statment for the decision. This "Best Interest" algorithm will continually get stronger and refined as AI is able to collect and analyze the data from the results of prior implemented decisions. This is what truly makes BRANI unique, token holders are able to help shape the future of the Brainzy AI ecosystem and AI DeFi.
        </p>
		<p style={{ fontSize: '18px', marginTop: '20px', color: '#1f00c2' }}>
          <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#1f00c2', fontWeight: '600', textDecoration: 'none' }}>
            📄 <u>Read the Whitepaper</u>
          </a>
        </p>
       
      </div>
<div style={{
  backgroundColor: '#f1f8fe',
  padding: '30px',
  textAlign: 'center',
  borderRadius: '10px',
  marginTop: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}}>

  <h2 style={{
    fontWeight: '500',
    fontSize: '22px',
    color: '222',
	textAlign: 'center',
    marginTop: '10px',
	marginBottom: '12px'
  }}>
  <strong>Tokenomics</strong>
  </h2>
  <p style={{ fontWeight: '500', fontSize: '16px', maxWidth: '900px', margin: '0 auto', lineHeight: '1.6', color: '#444' }}> <strong>Total Supply = 500,000,000 BRANI</strong> <br />The $BRANI token is designed to be the cornerstone of the Brainzy AI ecosystem. Here’s the breakdown of how tokens are allocated and utilized:
  </p>
  <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
    <div style={{ backgroundColor: '#e6f7ff', padding: '20px', textAlign: 'justify', borderRadius: '10px' }}>
      <h4 style={{ fontWeight: '500', fontSize: '20px', color: '#417ebf', textAlign: 'center' }}>
  <u>Airdrop - 10%</u><br />
  <span style={{ color: '#9ea834', fontSize: '16px' }}>50,000,000 BRANI</span>
</h4>
      <p style={{ fontSize: '16px', color: '#444' }}>Approximately 500 BRANI tokens per wallet are available to claim for 100,000 eligible wallets.</p>   
	</div>
    <div style={{ backgroundColor: '#e6ffed', padding: '20px', textAlign: 'justify', borderRadius: '10px' }}>
      <h4 style={{ fontWeight: '500', fontSize: '20px', color: '#417ebf', textAlign: 'center' }}>
	  <u>DAO Treasury - 20%</u><br />
	  <span style={{ color: '#9ea834', fontSize: '16px' }}>100,000,000 BRANI</span>
	  </h4>
      <p style={{ fontSize: '16px', color: '#444' }}>The DAO Treasury tokens are allocated to a Safe wallet that requires two signers to exchange these tokens. The BRANI Creator is currently the only signatory. Once the token is launched, AI will decide which token holder wallet will act as the second signatory on the DAO Treasury. At that time, the use of the DAO Treasury is dependent on token holder proposals and AI decisions.</p>
    </div>
	<div style={{ backgroundColor: '#f6f0ff', padding: '20px', textAlign: 'justify', borderRadius: '10px' }}>
      <h4 style={{ fontWeight: '500', fontSize: '20px', color: '#417ebf', textAlign: 'center' }}>
	  <u>Staking & Rewards - 30%</u><br />
	  <span style={{ color: '#9ea834', fontSize: '16px' }}>150,000,000 BRANI</span>
	  </h4>
      <p style={{ fontSize: '16px', color: '#444' }}>The Staking & Rewards Tokens are allocated in three parts: (1) 100,000,000 tokens dedicated to token holders who <strong>Stake</strong> their tokens and earn the 50% APY rewards; (2) 25,000,000 tokens allocated to the Presale to reward token holders and early adopters of BRANI; and (3) 25,000,000 tokens for future <strong>Rewards</strong>, which will be allocated in accordance with DAO processes and token holder proposals that are decided by AI.</p>
    </div>
    <div style={{ backgroundColor: '#fff7e6', padding: '20px', textAlign: 'justify', borderRadius: '10px' }}>
      <h4 style={{ fontWeight: '500', fontSize: '20px', color: '#417ebf', textAlign: 'center' }}>
	  <u>Liquidity Pool - 15%</u><br />
	  <span style={{ color: '#9ea834', fontSize: '16px' }}>75,000,000 BRANI</span>
	  </h4>
      <p style={{ fontSize: '16px', color: '#444' }}>The Liquidity Pool will be locked once adequately funded at an anticpated listing price that is 25% greater than the Presale price.</p>
    </div>
    <div style={{ backgroundColor: '#f3ffe6', padding: '20px', textAlign: 'justify', borderRadius: '10px' }}>
      <h4 style={{ fontWeight: '500', fontSize: '20px', color: '#417ebf', textAlign: 'center' }}>
	  <u>Marketing & Listings - 20%</u><br />
	  <span style={{ color: '#9ea834', fontSize: '16px' }}>100,000,000 BRANI</span>
	  </h4>
      <p style={{ fontSize: '16px', color: '#444' }}>25,000,000 of these tokens have been allocated to the Presale of BRANI to ensure the liquidity pool is properly funded.  The remaining tokens will be used to build partnerships with social media content creators as well as listings with exchanges to ensure the BRANI ecosystem continues to flourish and grow.</p>
    </div>
    <div style={{ backgroundColor: '#e6f7e6', padding: '20px', textAlign: 'justify', borderRadius: '10px' }}>
      <h4 style={{ fontWeight: '500', fontSize: '20px', color: '#417ebf', textAlign: 'center' }}>
	  <u>Creator Rewards - 5%</u><br />
	  <span style={{ color: '#9ea834', fontSize: '16px' }}>25,000,000 BRANI</span>
	  </h4>
      <p style={{ fontSize: '16px', color: '#444' }}>The average percentage of token supply reserved by creators for their own rewards varies, but on average is in the range of 10% - 30%. The 5% of BRANI allocated to Creator Rewards was done intentionally to ensure a "Fair Launch" and prevent the "Rug Pulling" and "Pump and Dump" that occurs in so many crypto coins today.</p>
    </div>
  </div>

</div>
<div style={{
  marginBottom: '20px',
  textAlign: 'center'
}}>
  <h2 style={{
    fontSize: '24px',
    color: '#222',
    marginBottom: '10px',
    letterSpacing: '1px'
  }}>
    🗺️ $BRANI Roadmap
  </h2>
  <p style={{
    fontSize: '16px',
    color: '#444',
    maxWidth: '700px',
    margin: '0 auto'
  }}>
    Here’s what we’re building — step by step. A clear roadmap from launch to AI-powered governance, staking rewards, and global scale.
  </p>
</div>
{/* ROADMAP SECTION */}
<div style={{
  backgroundColor: '#f5faff',
  padding: '20px 20px',
  marginTop: '30px',
  borderTop: '2px solid #dbe6f1',
  borderBottom: '2px solid #dbe6f1',
  textAlign: 'left'
}}>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'left'
  }}>
    
    {/* Phase 1 */}
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #cce4f6',
      borderRadius: '10px',
      padding: '20px'
    }}>
      <h3 style={{ color: '#417ebf' }}>📍 Q2 — Presale & Launch</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Website & Whitepaper Live✅</li>
        <li>Smart Contract Verified✅</li>
        <li>Telegram + Twitter Launch✅</li>
        <li><strong>Presale Starts: May 1, 2025</strong></li>
        <li>Token Claim Opens After Presale</li>
		<li>DAO Governance Deployed</li>
        <li>Proposal + Voting Enabled</li>
        <li>Launch of DAO Treasury System</li>
        <li>First Community Vote + AMA</li>
      </ul>
    </div>

    {/* Phase 2 */}
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #cce4f6',
      borderRadius: '10px',
      padding: '20px'
    }}>
      <h3 style={{ color: '#417ebf' }}>📍 Q3 — Staking & Utility</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Open $BRANI Staking Pools</li>
        <li>Rewards + Lock/Earn Functions</li>
        <li>Community Leaderboard Launch</li>
		<li>AI Voting Engine Deployed</li>
        <li>Proposal Auto-Analysis by AI</li>
        <li>Feedback + Data Integration</li>
        <li>Algorithm Optimization</li>
      </ul>
    </div>

    {/* Phase 3 */}
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #cce4f6',
      borderRadius: '10px',
      padding: '20px'
    }}>
      <h3 style={{ color: '#417ebf' }}>📍 Q4 — Scaling & Listings</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Apply to CoinGecko & CMC</li>
        <li>Tier 2+ CEX Listings</li>
        <li>Strategic Partnerships</li>
        <li>Launch Grants & SDK for Builders</li>
      </ul>
    </div>
  </div>
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

  <h2 style={{ fontSize: '24px', color: '222', marginBottom: '8px', textAlign: 'center' }}>
    👨‍💻 Meet the Founder 
	</h2>
  <h3 style={{ fontSize: '22px', color: '222', marginBottom: '0px', textAlign: 'center' }}>
        Ryan R. Putz
    </h3>
  <p style={{ fontSize: '18px', color: '444', textAlign: 'center', marginBottom: '14px', marginTop: '4px' }}>
   Founder/Creator/Developer
  </p>   
  <SocialIcon url="https://linkedin.com/in/brainzytoken"
    style={{ height: 32, width: 32, alignment: 'center', marginBottom: '14px' }}
  />
  <p>
    📬 <a 
      href="mailto:developer@brainzytoken.com" 
      style={{ color: '#1f00c2', textDecoration: 'none', fontWeight: '500' }}
    >
      <u>developer@brainzytoken.com</u>
    </a>
  </p>
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
</div>
{/* Airdrop Section */}
      <div className="section" style={{ backgroundColor: '#111827', color: '#fff', padding: '10px', marginTop: '5px' }}>
        <AirdropClaim />
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