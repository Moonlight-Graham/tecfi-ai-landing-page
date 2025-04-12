import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './index.css';
import Dashboard from './components/Dashboard';
import tokenABI from './abi/TecFiTokenABI';

const tokenAddress = "0xEc34Fd8C49F0F87266c45e296CDC717c52D7B2e9";

function App() {
  const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
  if (window.ethereum) {
    try {
      setLoading(true);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum); 
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, tokenABI, signer);

      const balance = await contract.balanceOf(accounts[0]);
      const tokenSymbol = await contract.symbol();

      setTokenBalance(ethers.utils.formatUnits(balance, 6));
      setSymbol(tokenSymbol);
      setLoading(false);
    } catch (error) {
      console.error("Error during wallet connection:", error);
      setLoading(false);
      alert("Error connecting wallet: " + error.message);
    }
  } else {
    alert("Please install MetaMask to use this dApp.");
  }
};

  useEffect(() => {
    // Optional auto-connect
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* Add Icon to the Top */}
      <div style={{ marginBottom: '20px' }}>
        <img 
          src="/tecfiai-icon-32x32.svg" 
          alt="TecFi AI Icon" 
          style={{ width: '64px', height: '64px' }} 
        />
      </div>
	  {!account ? (
        <div>
          <h1>TecFi AI Governance DApp</h1>
          <p>This is the official site of TecFi AI.</p>
          <p>Connect your wallet to begin.</p>
          <button onClick={connectWallet} disabled={loading} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      ) : (
        <Dashboard 
          account={account} 
          balance={tokenBalance} 
          symbol={symbol} 
        />
      )}
    </div>
  );
}

export default App;

