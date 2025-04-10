import React, { useState } from "react";
import { ethers } from "ethers";
import TokenBalance from './components/TokenBalance';
import StakingDashboard from './components/StakingDashboard';
import ProposalDashboard from './components/ProposalDashboard';
import './index.css';
import { supabase } from './components/supabaseClient';
import HistoryLog from './components/HistoryLog';
import tokenABI from './abi/TecFiTokenABI.json';

const tokenAddress = "0xEc34Fd8C49F0F87266c45e296CDC717c52D7B2e9";

function App() {
  const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, tokenABI, signer);
        const balance = await contract.balanceOf(accounts[0]);
        const symbol = await contract.symbol();

        setTokenBalance(ethers.formatUnits(balance, 6) + " " + symbol);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install MetaMask to use this dApp.");
    }
  };

  return (
    <div className="App" style={{ padding: "2rem", textAlign: "center" }}>
      <h1>TECFI AI Governance DApp</h1>
	  <img src="/tecfiai-icon-32x32.svg" alt="TecfiAI Icon" width="32" height="32" />
      <p>This is the official site for TecfiAI.</p>
         {!account ? (
  <>
    <p>🔌 Connect your wallet to begin:</p>
    <button
      onClick={connectWallet}
      style={{
        padding: "0.7rem 1.5rem",
        fontSize: "1rem",
        cursor: "pointer",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#0070f3",
        color: "white",
        marginBottom: "1rem",
      }}
    >
      🪙 Connect Wallet
    </button>

    <div style={{ maxWidth: "500px", margin: "0 auto", fontSize: "0.95rem", lineHeight: "1.6", color: "#444", textAlign: "left" }}>
      <br /><br />
	  <strong>📱 To connect your wallet on mobile:</strong>
      <br /><br />
      ✅ <strong>Step-by-step (MetaMask Mobile Browser)</strong><br />
      1. Open the <strong>MetaMask</strong> app on your phone.<br />
      2. Locate the menu bar at the bottom.<br />
      3. Tap “<strong>Browser</strong>” (MetaMask has its own built-in browser).<br />
      4. In the browser bar (at the top of the screen), type the URL: <strong>https://www.tecfiai.com</strong>.<br />
      5. Your DApp will now detect MetaMask and allow wallet connection ✅
    </div>
  </>
) : (
  <>
    <TokenBalance account={account} balance={tokenBalance} />
    <StakingDashboard account={account} />
    <ProposalDashboard account={account} tokenBalance={tokenBalance} />
  </>
)}
    </div>
  );
const fetchBalance = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(tokenAddress, tokenABI, provider);
    const rawBalance = await contract.balanceOf(account);
    const decimals = await contract.decimals();
    const formatted = ethers.utils.formatUnits(rawBalance, decimals);
    setBalance(formatted);
  } catch (error) {
    console.error("Error fetching balance:", error);
    setBalance("Error");
  }
};
}

export default App;