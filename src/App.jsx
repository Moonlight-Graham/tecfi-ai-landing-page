import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import TokenBalance from "./components/TokenBalance";
import StakingDashboard from "./components/StakingDashboard";
import ProposalDashboard from "./components/ProposalDashboard";
import HistoryLog from "./components/HistoryLog";
import WalletCard from "./components/WalletCard";
import Landing from "./components/Landing";
import tokenABI from "./abi/TecFiTokenABI";
import "./index.css";

const tokenAddress = "0xEc34f8C49F082766c45e296CDC717c52D7B2e9";

function App() {
  const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(tokenAddress, tokenABI, signer);
        const balance = await contract.balanceOf(accounts[0]);
        const decimals = await contract.decimals();
        const formatted = ethers.formatUnits(balance, decimals);

        setAccount(accounts[0]);
        setTokenBalance(formatted);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install MetaMask to use this dApp.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setTokenBalance(null);
  };

  return (
    <>
      {!account ? (
        <Landing connectWallet={connectWallet} />
      ) : (
        <div style={{ padding: "2rem" }}>
          <WalletCard
            account={account}
            tokenBalance={tokenBalance}
            onDisconnect={disconnectWallet}
          />

          <TokenBalance account={account} balance={tokenBalance} />
          <StakingDashboard account={account} />
          <ProposalDashboard account={account} tokenBalance={tokenBalance} />
          <HistoryLog />
        </div>
      )}
    </>
  );
}

export default App;

