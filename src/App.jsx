import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import tokenABI from './abi/XynapzCoinABI.json';
import Presale from './components/Presale';
import { SocialIcon } from 'react-social-icons';
import AirdropClaim from './components/AirdropClaim';
import TokenomicsChart from './components/TokenomicsChart';
import DemoDashboard from './components/DemoDashboard';

// Smart contract addresses
const tokenAddress = '0x72608ECBDfd2516F6Fe1d9341A9019C4305E0BA8';
const presaleAddress = '0x1D8Ba8577C3012f614695393fcfDa7C308622939';
const stakingAddress = '0xe0a6c66f2B9F36aAF30fEF6985Ee3f52A0F1a8e1';
const presaleStartTime = 1748041200;

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [symbol, setSymbol] = useState('XNAPZ');
  const [loading, setLoading] = useState(false);
  const [ethPrice, setEthPrice] = useState(null);
  const [presaleContract, setPresaleContract] = useState(null);
  const [ethRaised, setEthRaised] = useState('0');
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  // 🟢 CONNECT WALLET FUNCTION
  const connectDemoWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
      const balance = await tokenContract.balanceOf(address);
      const formatted = parseFloat(ethers.utils.formatUnits(balance, 6)); // Adjust decimals if needed

      setWalletConnected(true);
      setWalletAddress(address);
      setTokenBalance(formatted);
      setAccount(address);
      setHasAccess(formatted >= 500);
    } catch (err) {
      console.error('Wallet connect error:', err);
      alert('Could not connect wallet.');
    }
  };

  // 🔴 DISCONNECT WALLET FUNCTION
  const disconnectDemoWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setTokenBalance(0);
    setHasAccess(false);
    setAccount(null);
  };

  // 🎨 Button Style
  const demoButtonStyle = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '8px',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
    transition: 'all 0.3s ease-in-out',
  };

  const disconnectButtonStyle = {
    ...demoButtonStyle,
    backgroundColor: '#e11d48',
    boxShadow: '0 0 10px rgba(225, 29, 72, 0.6)',
  };

  return (
    <>
      
{/* HEADER */}
<div style={{
  backgroundColor: '#03162f',
  padding: '20px 0',
  borderBottom: '1px solid #ddd',
  textAlign: 'center',
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
}}>
{/* 🔥 PRESALE BANNER */}
  <div style={{
    backgroundColor: '#0f172a',
    color: '#fff',
    padding: '10px',
    fontSize: '15px',
    fontWeight: '500',
    overflow: 'hidden',
    position: 'relative',
    whiteSpace: 'nowrap',
  }}>
    <div style={{
      display: 'inline-block',
      paddingLeft: '100%',
      animation: 'scrollBanner 30s linear infinite'
    }}>
      🚀 Presale Goes Live May 23 · Price increases weekly · Ends June 27 · Follow us on X and join Telegram!
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
    <p style={{
      borderTop: '4px',
	  fontSize: '16px',
      color: '#e9ecec',
      margin: '0 0 6px 6px',
    }}>The Official Governance dApp of Xynapz Coin</p>
	<h2 style={{
  margin: '10px 4px 6px 4px',
  fontSize: '34px',
  fontWeight: '800',
  color: '#38bdf8', // light cyan
  textShadow: '0 0 10px rgba(56, 189, 248, 0.4)', // soft glow
  letterSpacing: '0.5px'
}}>
  Xynapz Coin
</h2>

<p style={{
  fontSize: '18px',
  fontWeight: '600',
  color: '#c084fc', // soft purple
  margin: '0 0 10px 0',
  letterSpacing: '0.4px',
  textShadow: '0 0 6px rgba(192, 132, 252, 0.3)' // glowing subline
}}>
  Holders Vote • AI Decides
</p>
	<div style={{ marginTop: '15px', marginBottom: '10' }}>
    <img src="/xnapz-icon-64x64.png" alt="XNAPZ Icon" width={48} height={48} />
	<p style={{
      fontWeight: '500',
      fontSize: '15px',
      color: '#5ea32f',
      marginTop: '4px',
	  marginBottom: '6px',
    }}>AI-Governed. DAO Powered. 50% Rewards.</p>
    
</div>
{/* SOCIAL LINKS SECTION */}
<div style={{
  backgroundColor: '#03162f',
  padding: '10px 0px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderTop: '1px solid #1e293b',
  borderBottom: '1px solid #1e293b',
  gap: '40px'
}}>
  <SocialIcon url="https://x.com/xynapzcoin"
    style={{
      height: 30,
      width: 30,
      borderRadius: '50%',
      backgroundColor: '#1d4ed8',
      boxShadow: '0 0 6px #38bdf8'
    }} />
    
  <SocialIcon url="https://t.me/xynapzcoin"
    style={{
      height: 30,
      width: 30,
      borderRadius: '50%',
      backgroundColor: '#0ea5e9',
      boxShadow: '0 0 6px #7dd3fc'
    }} />
</div>
{/* Contract Links */}
<div style={{
  backgroundColor: '#03162f',
  padding: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderBottom: 'none',
  gap: '40px'
}}>
<h3 style={{
    color: '#e8e4e5',
	fontWeight: '500',
	fontSize: '14.5px',
    marginBottom: '4px',
  }}>
    📄 Verified Contract Links:
    </h3>
</div><a href={`https://etherscan.io/address/${tokenAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#e8e4e5',
        fontWeight: '500',
        fontSize: '14px',
        textDecoration: 'none',
		align: 'center',
		marginRight: '6.5px'
      }}
    >
      <u>Token Contract</u></a>
	  <a href={`https://etherscan.io/address/${presaleAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#e8e4e5',
        fontWeight: '500',
        fontSize: '14px',
        textDecoration: 'none',
		align: 'center',
		marginRight: '6.5px'
      }}
    >
      <u>Presale Contract</u></a>
	  <a
      href={`https://etherscan.io/address/${stakingAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#e8e4e5',
        fontWeight: '500',
        fontSize: '14px',
        textDecoration: 'none',
		align: 'center'
      }}
    >
      <u>Staking Contract</u></a>
 {/* 🔐 Demo Dashboard Access Section */}
      <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
        {!walletConnected ? (
          <button onClick={connectDemoWallet} style={demoButtonStyle}>
            ⚡ Connect Wallet to Access Demo
          </button>
        ) : hasAccess ? (
          <>
            <p style={{ color: '#38bdf8' }}>
              ✅ Connected: <strong>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</strong>
            </p>
            <p style={{ color: '#ccc' }}>Your Balance: {tokenBalance} XNAPZ</p>
            <button onClick={disconnectDemoWallet} style={disconnectButtonStyle}>
              🛑 Disconnect Wallet
            </button>

            <div style={{ marginTop: '2rem' }}>
              <DemoDashboard
                walletAddress={walletAddress}
                tokenBalance={tokenBalance}
                onDisconnect={disconnectDemoWallet}
              />
            </div>
          </>
        ) : (
          <p style={{ color: '#facc15' }}>
            ⚠️ You need at least <strong>500 XNAPZ</strong> to view the demo.
          </p>
        )}
      </div>

{/* Presale Section */}
     <div className="section" style={{ 
	  backgroundColor: '#0f172a', 
	  color: 'fff', 
	  padding: '20px', 
	  textAlign: 'center', 
	  borderRadius: '12px', 
	  maxWidth: '750px',
      marginTop: '10px',
      marginBottom: '10px',
      margin: '1.5rem auto',
      boxShadow: '0 0 10px #22d3ee55'
    }}>
	  <Presale />
	 </div>
{/* Airdrop Section */}
      <div className="section" style={{ backgroundColor: '#3B496A', color: '#fff', padding: '20px', marginTop: '20px', marginBottom: '20px' }}>
        <AirdropClaim />
      </div>
	  {/* ABOUT SECTION */}
      <div style={{ backgroundColor: '#f5faff', padding: '30px', textAlign: 'center', marginTop: '4px' }}>
        <img 
          src="/xnapz-icon-32x32.svg"  
          alt="XNAPZ Icon" 
          style={{ width: '48px', height: '48px', marginTop: '10px', marginBottom: '10px', maxWidth: '100%' }} 
        />
        <h2 style={{ fontSize: '26px', marginBottom: '15px', color: '#222' }}>About Xynapz Coin</h2>
        <p style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto 15px', lineHeight: '1.6', color: '#444', textAlign: 'justify' }}>
          <strong>Xynapz Coin ($XNAPZ)</strong> is a governance-driven DeFi token built on Ethereum.  It is designed to merge the power of Artificial Intelligence ("AI") with Decentralized Finance ("DeFi").  XNAPZ empowers token holders to guide the evolution of AI development through transparent, off-chain DAO processes. 
        </p>
        <img 
          src="/xnapz-icon-32x32.svg" 
          alt="XNAPZ Icon" 
          style={{ width: '48px', height: '48px', marginTop: '20px', marginBottom: '10px', maxWidth: '100%' }} 
        />
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#222' }}>Holders Vote & AI Decides</h2>
        <p style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto 15px', lineHeight: '1.6', color: '#444', textAlign: 'justify' }}>
          XNAPZ rewards participation and transparency. Twenty Percent (20%) of the token supply goes to a DAO Treasury locked in a Safe Wallet. Token holders create proposals and then vote on which proposals should be submitted to AI for decision. AI decides based on a "Token Holder Best Interest" algorithm, and AI provides a reasoning statement for the decision. This "Best Interest" algorithm will continually get stronger and refined as AI is able to collect and analyze the data from the results of prior implemented decisions. This is what truly makes XNAPZ unique, token holders are able to help shape the future of the Xynapz Coin ecosystem and AI DeFi.
        </p>
		<p style={{ fontSize: '18px', marginTop: '20px', color: '#1f00c2' }}>
          <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#1f00c2', fontWeight: '600', textDecoration: 'none' }}>
            📄 <u>Read the Whitepaper</u>
          </a>
        </p>
       
      </div>
	  {/* TokenomicsChart Section */}
	 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
    <TokenomicsChart />
	</div>
      
<div style={{
  backgroundColor: '#f1f8fe',
  padding: '30px',
  borderRadius: '10px',
  marginTop: '10px',
  textAlign: 'center',
  maxWidth: '1100px',
  marginLeft: 'auto',
  marginRight: 'auto',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
}}>
  <h2 style={{
    fontWeight: '600',
    fontSize: '24px',
    color: '#111',
    marginBottom: '20px'
  }}>
    Token Utility & Distribution
  </h2>
  <p style={{
    fontSize: '16px',
    color: '#444',
    marginBottom: '24px',
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto'
  }}>
    <strong>Total Supply:</strong> 500,000,000 XNAPZ<br />
    Each category below represents a key component of Xynapz Coin’s token economy and utility:
  </p>

  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  }}>
    <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: '10px' }}>
      <h4 style={{ color: '#EFB112', marginBottom: '8px' }}>Airdrop</h4>
      <p style={{ fontSize: '14px', color: '#333' }}>500 XNAPZ tokens per wallet are available to claim for up to 100,000 wallets.</p>
    </div>

    <div style={{ backgroundColor: '#f6f0ff', padding: '16px', borderRadius: '10px' }}>
      <h4 style={{ color: '#07C71E', marginBottom: '8px' }}>Staking & Rewards</h4>
      <p style={{ fontSize: '14px', color: '#333' }}>Split into staking incentives, presale rewards, and future DAO-based rewards.</p>
    </div>

    <div style={{ backgroundColor: '#fff7e6', padding: '16px', borderRadius: '10px' }}>
      <h4 style={{ color: '#7A7B7B', marginBottom: '8px' }}>Liquidity Pool</h4>
      <p style={{ fontSize: '14px', color: '#333' }}>Locked when anticipated listing price objective of (100,000 XNAPZ = 1 ETH) is achieved.</p>
    </div>

    <div style={{ backgroundColor: '#e6ffed', padding: '16px', borderRadius: '10px' }}>
      <h4 style={{ color: '#7A0BA6', marginBottom: '8px' }}>Marketing & Listings</h4>
      <p style={{ fontSize: '14px', color: '#333' }}>Used to fund influencer partnerships and exchange listings post-launch.</p>
    </div>

    <div style={{ backgroundColor: '#f3ffe6', padding: '16px', borderRadius: '10px' }}>
      <h4 style={{ color: '#0D66F6', marginBottom: '8px' }}>DAO Treasury</h4>
      <p style={{ fontSize: '14px', color: '#333' }}>Held in a multisig wallet, controlled by token holders via AI-powered proposals.</p>
    </div>

    <div style={{ backgroundColor: '#e6f7e6', padding: '16px', borderRadius: '10px' }}>
      <h4 style={{ color: '#4A4331', marginBottom: '8px' }}>Creator Rewards</h4>
      <p style={{ fontSize: '14px', color: '#333' }}>A modest 5% allocation ensures fairness, avoiding common 'dev dump' patterns.</p>
    </div>
  </div>
  
</div>
<div style={{
  marginTop: '10px',
  marginBottom: '20px',
  textAlign: 'center'
}}>
  <h2 style={{
    fontSize: '24px',
    color: '#a7e5f9',
    marginBottom: '10px',
    letterSpacing: '1px'
  }}>
    🗺️ $XNAPZ Roadmap
  </h2>
  <p style={{
    fontSize: '16px',
    color: '#fafdff',
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
        <li><strong>Presale Starts: May 23, 2025</strong></li>
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
        <li>Open $XNAPZ Staking Pools</li>
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
    src="/xnapz-icon-32x32.svg" 
    alt="XNAPZ Icon" 
    style={{ width: '48px', height: '48px', marginBottom: '15px' }} 
  />

  <h2 style={{ fontSize: '24px', color: '222', marginBottom: '8px', textAlign: 'center' }}>
    👨‍💻 Meet the Founder 👨‍💻
	</h2>
  <h3 style={{ fontSize: '22px', color: '222', marginBottom: '0px', textAlign: 'center' }}>
        Ryan R. Putz
    </h3>
  <p style={{ fontSize: '18px', color: '444', textAlign: 'center', marginBottom: '14px', marginTop: '4px' }}>
   Founder/Creator/Developer
  </p>   
  <SocialIcon url="https://www.linkedin.com/in/xynapzcoin/"
    style={{ height: 32, width: 32, alignment: 'center', marginBottom: '14px' }}
  />
  <p>
    📬 <a 
      href="mailto:developer@xynapzcoin.com" 
      style={{ color: '#1f00c2', textDecoration: 'none', fontWeight: '500' }}
    >
      <u>developer@xynapzcoin.com</u>
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
    he brings legal expertise and technical innovation to the Xynapz Coin project. As the sole founder of Xynapz Coin, 
    Ryan is fully doxxed and publicly verifiable. His commitment to transparency and ethics sets XNAPZ apart.
  </p>
</div>

{/* Contact Footer */}
<footer style={{
  backgroundColor: '#f7f9fc',
  padding: '20px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#555',
  borderTop: '1px solid #e0e0e0',
  marginTop: '10px'
}}>
  <p>
    Built with ❤️ by <strong>Ryan R. Putz</strong> · All Rights Reserved © {new Date().getFullYear()}
  </p>
  <p>
    📬 <a 
      href="mailto:developer@xynapzcoin.com" 
      style={{ color: '#1f00c2', textDecoration: 'none', fontWeight: '500' }}
    >
      <u>developer@xynapzcoin.com</u>
    </a>
  </p>
  <img src="/xnapz-icon-32x32.svg" alt="XNAPZ Icon" width={32} height={32} />
</footer>
     </div>
    </>
  );
}

export default App;