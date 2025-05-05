import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import tokenABI from '../abi/XynapzCoinABI.json';
import stakingABI from '../abi/XynapzStakingABI.json';
import HistoryLog from './HistoryLog';
import ProposalForm from './ProposalForm';
import { aiReviewProposal } from '../utils/aiReview';

const TOKEN_ADDRESS = '0x721068CCBDEd2516f8FE134019C4305E0BA8'; // Replace with actual
const STAKING_ADDRESS = '0xe002c6c6f6289F36cA30FF6985Ee3f52A0F1a8e1';
const QUORUM_TOKENS = 2000000;

const Dashboard = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [eligible, setEligible] = useState(false);
  const [checking, setChecking] = useState(false);

  const [balance, setBalance] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [votes, setVotes] = useState([]);
  const [provider, setProvider] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [staked, setStaked] = useState('0');
  const [reward, setReward] = useState('0');
  const [inputAmount, setInputAmount] = useState('');
  const [estimates, setEstimates] = useState(null);
  const [historyLog, setHistoryLog] = useState([]);

  // Connect wallet and check balance
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      setChecking(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenABI, provider);
      const balance = await tokenContract.balanceOf(address);
      const formatted = parseFloat(ethers.utils.formatUnits(balance, 6));
      setTokenBalance(formatted.toFixed(2));
      setEligible(formatted >= 500);
    } catch (err) {
      console.error("Wallet connect failed:", err);
      alert("Connection failed");
    } finally {
      setChecking(false);
    }
  };

  // Load staking contract
  useEffect(() => {
    if (!walletAddress || typeof window.ethereum === 'undefined') return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(STAKING_ADDRESS, stakingABI, provider);
    setProvider(provider);
    setStakingContract(contract);
  }, [walletAddress]);

  const stake = async () => {
    if (!provider || !stakingContract || !inputAmount) return;
    const signer = await provider.getSigner();
    const contract = stakingContract.connect(signer);
    const amount = ethers.utils.parseUnits(inputAmount, 6);
    const tx = await contract.stake(amount);
    await tx.wait();
    alert("Staked successfully!");
  };

  const unstake = async () => {
    if (!provider || !stakingContract) return;
    const signer = await provider.getSigner();
    const contract = stakingContract.connect(signer);
    const tx = await contract.unstake(ethers.utils.parseUnits(staked, 6));
    await tx.wait();
    alert("Unstaked successfully!");
  };

  const claimRewards = async () => {
    if (!provider || !stakingContract) return;
    const signer = await provider.getSigner();
    const contract = stakingContract.connect(signer);
    const tx = await contract.claimRewards();
    await tx.wait();
    alert("Rewards claimed!");
  };

  const calculateEstimate = () => {
    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) return;
    const apy = 0.50;
    const yearly = amount * apy;
    const monthly = yearly / 12;
    const daily = yearly / 365;
    setEstimates({
      daily: daily.toFixed(2),
      monthly: monthly.toFixed(2),
      yearly: yearly.toFixed(2),
    });
  };

  const sectionStyle = {
    background: '#111827',
    padding: '2rem',
    borderRadius: '20px',
    marginBottom: '2rem',
    boxShadow: '0 0 20px #22d3ee66',
    border: '1px solid #22d3ee',
    color: '#fff',
  };

  const buttonStyle = {
    padding: '10px 16px',
    margin: '10px 10px 0 0',
    background: '#06b6d4',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 0 10px #06b6d4',
  };

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "900px",
      margin: "0 auto",
      fontFamily: "'Orbitron', sans-serif"
    }}>
      {/* Header with connect button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0d0d2b',
        padding: '1rem 2rem',
        borderBottom: '2px solid #22d3ee',
        borderRadius: '10px',
        marginBottom: '2rem',
        color: '#fff',
      }}>
        <h2 style={{
          fontSize: '24px',
          color: '#66f9ff',
          textShadow: '0 0 8px #0ff'
        }}>XNAPZ Governance Dashboard</h2>

        {walletAddress ? (
          <div style={{ textAlign: 'right', fontSize: '14px' }}>
            <div><strong>Wallet:</strong> {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</div>
            <div><strong>Balance:</strong> {tokenBalance} XNAPZ</div>
		   <button
    onClick={disconnectWallet}
    style={{
      padding: '8px 16px',
      background: '#ff4d4d',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      boxShadow: '0 0 10px #ff4d4daa',
      fontWeight: '600'
    }}
  >
    🔌 Disconnect
  </button>
</div>
        ) : (
          <button onClick={connectWallet} disabled={checking} style={buttonStyle}>
            {checking ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>

      {/* Gate access */}
      {!eligible ? (
        <p style={{ color: '#c084fc', textAlign: 'center' }}>
           You need at least <strong>500 XNAPZ</strong> to access the governance dashboard.
        </p>
      ) : (
        <>
          {/* Staking Section */}
          <div style={sectionStyle}>
            <h2>🔥 Staking Dashboard</h2>
            <p><strong>Wallet:</strong> {walletAddress}</p>
            <p><strong>Balance:</strong> {balance.toLocaleString()} XNAPZ</p>
            <p><strong>Currently Staked:</strong> {staked} XNAPZ</p>
            <p><strong>Reward:</strong> {reward} XNAPZ</p>
            <input
              type="number"
              placeholder="Enter amount"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              style={{
                padding: '12px',
                width: '100%',
                borderRadius: '6px',
                background: '#0f172a',
                color: '#fff',
                border: '1px solid #22d3ee',
                marginTop: '10px',
              }}
            />
            <div style={{ marginTop: '1rem' }}>
              <button style={buttonStyle} onClick={stake}>Stake</button>
              <button style={buttonStyle} onClick={unstake}>Unstake</button>
              <button style={buttonStyle} onClick={claimRewards}>Claim</button>
              <button style={buttonStyle} onClick={calculateEstimate}>Estimate Rewards</button>
            </div>
            {estimates && (
              <div style={{ marginTop: '1rem' }}>
                <p>📆 Daily: {estimates.daily} XNAPZ</p>
                <p>🗓️ Monthly: {estimates.monthly} XNAPZ</p>
                <p>📅 Yearly: {estimates.yearly} XNAPZ</p>
              </div>
            )}
          </div>
          <ProposalForm />
          {/* Governance History Log */}
          <div style={sectionStyle}>
            <h2>📊 Governance History</h2>
            {historyLog.length === 0 ? (
              <p>📄 No log entries yet.</p>
            ) : (
              <HistoryLog entries={historyLog} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

