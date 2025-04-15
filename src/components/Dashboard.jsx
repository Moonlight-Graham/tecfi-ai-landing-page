import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import tokenABI from '../abi/BrainzyTokenABI.json';
import stakingABI from '../abi/BrainzyStakingABI.json';
import HistoryLog from './HistoryLog';
import supabase from './supabaseClient';
import { aiReviewProposal } from '../utils/aiReview';

const TOKEN_ADDRESS = '0xDD9d0827Ee76Ae85762DD30976C3883bbC89A0D5';
const STAKING_ADDRESS = '0xF1A5df39FBDf23459ad1cb6D2633F857C2bAebfa';
const QUORUM_TOKENS = 20000000;

const Dashboard = ({ account }) => {
  const [balance, setBalance] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [votes, setVotes] = useState([]);
  const eligible = balance >= 10000;

  const [provider, setProvider] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [staked, setStaked] = useState('0');
  const [reward, setReward] = useState('0');
  const [inputAmount, setInputAmount] = useState('');
  const [estimates, setEstimates] = useState(null);
  const [historyLog, setHistoryLog] = useState([]);

  // Load Token Balance
  useEffect(() => {
    if (!account) return;
    const fetchBalance = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(TOKEN_ADDRESS, tokenABI, provider);
        const balance = await contract.balanceOf(account);
        const decimals = await contract.decimals();
        const formatted = parseFloat(ethers.utils.formatUnits(balance, decimals));
        setBalance(formatted);
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      }
    };
    fetchBalance();
  }, [account]);

  // Load Staking Contract
  useEffect(() => {
    if (!account || typeof window.ethereum === 'undefined') return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(STAKING_ADDRESS, stakingABI, provider);
    setProvider(provider);
    setStakingContract(contract);
  }, [account]);

  // Load Staking Info
  useEffect(() => {
    const loadStakingInfo = async () => {
      if (!stakingContract || !account) return;
      try {
        const stakeInfo = await stakingContract.getStakeInfo(account);
        const rewardRaw = await stakingContract.calculateReward(account);
        setStaked(ethers.utils.formatUnits(stakeInfo[0], 6));
        setReward(ethers.utils.formatUnits(rewardRaw, 6));
      } catch (err) {
        console.error("Staking info error:", err);
      }
    };
    loadStakingInfo();
  }, [stakingContract, account]);

  // Fetch Governance History
  useEffect(() => {
    const fetchHistoryLog = async () => {
      const { data, error } = await supabase.from("HistoryLog").select("*").order('created_at', { ascending: false });
      if (error) console.error("Error fetching history log:", error);
      else setHistoryLog(data);
    };
    fetchHistoryLog();
  }, []);

  const stake = async () => {
    if (!provider || !stakingContract || !inputAmount) return;
    const signer = await provider.getSigner();
    const contract = stakingContract.connect(signer);
    try {
      const amount = ethers.utils.parseUnits(inputAmount, 6);
      const tx = await contract.stake(amount);
      await tx.wait();
      alert("Staked successfully!");
    } catch (err) {
      console.error("Stake error:", err);
    }
  };

  const unstake = async () => {
    if (!provider || !stakingContract) return;
    const signer = await provider.getSigner();
    const contract = stakingContract.connect(signer);
    try {
      const tx = await contract.unstake(ethers.utils.parseUnits(staked, 6));
      await tx.wait();
      alert("Unstaked successfully!");
    } catch (err) {
      console.error("Unstake error:", err);
    }
  };

  const claimRewards = async () => {
    if (!provider || !stakingContract) return;
    const signer = await provider.getSigner();
    const contract = stakingContract.connect(signer);
    try {
      const tx = await contract.claimRewards();
      await tx.wait();
      alert("Rewards claimed!");
    } catch (err) {
      console.error("Claim error:", err);
    }
  };

  const calculateEstimate = () => {
    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) return;
    const apy = .50;
    const yearly = amount * apy;
    const monthly = yearly / 12;
    const daily = yearly / 365;
    setEstimates({
      daily: daily.toFixed(2),
      monthly: monthly.toFixed(2),
      yearly: yearly.toFixed(2),
    });
  };

  const handleSummarize = async () => {
    if (!description) return;
    const fakeSummary = description.length > 100 ? description.slice(0, 100) + "..." : description;
    setSummary(`Summary: ${fakeSummary}`);
  };

  const handleSubmitProposal = (e) => {
    e.preventDefault();
    const newProposal = {
      title,
      description,
      summary,
      creator: account,
      votes: 0,
      aiReviewed: false,
      reviewDecision: '',
      reviewReason: '',
    };
    setProposals([...proposals, newProposal]);
    setTitle('');
    setDescription('');
    setSummary('');
  };

  const handleVote = async (index, isFor) => {
    const updated = [...proposals];
    if (updated[index].voters?.includes(account)) return;

    updated[index].votes += balance;
    updated[index].voters = [...(updated[index].voters || []), account];
    setProposals(updated);

    const voteCount = updated[index].votes;
    const progress = (voteCount / QUORUM_TOKENS) * 100;

    if (progress >= 100 && !updated[index].aiReviewed) {
      try {
        const result = await aiReviewProposal(updated[index].description);
        updated[index].aiReviewed = true;
        updated[index].reviewDecision = result.decision;
        updated[index].reviewReason = result.reason;
        const { error } = await supabase.from("HistoryLog").insert([{
          title: updated[index].title,
          description: updated[index].description,
          decision: result.decision,
          reason: result.reason,
        }]);
        setProposals([...updated]);
        if (error) console.error("Supabase insert error:", error);
      } catch (err) {
        console.error("AI Review Failed:", err);
      }
    }
  };

  const quorumPercent = (votes) => ((votes / QUORUM_TOKENS) * 100).toFixed(1);

  const sectionStyle = {
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    marginBottom: "2rem",
  };

  const buttonStyle = {
    padding: "10px 16px",
    background: "#46cef5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
  };

  return (
    <>
      <div style={{ padding: ".2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
        <h1 style={{ textAlign: "center" }}>💎 BRAINZY AI DAO Dashboard 💎</h1>

        {/* Staking Section */}
        <div style={sectionStyle}>
          <h2>🔥 Staking Dashboard</h2>
          <p><strong>Wallet:</strong> {account}</p>
          <p><strong>Balance:</strong> {balance.toLocaleString()} BRANI</p>
          <p><strong>Currently Staked:</strong> {staked} BRANI</p>
          <p><strong>Reward:</strong> {reward} BRANI</p>
          <input
            type="number"
            placeholder="Enter amount"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
          />
          <div style={{ marginTop: '1rem' }}>
            <button style={buttonStyle} onClick={stake}>Stake</button>
            <button style={buttonStyle} onClick={unstake}>Unstake</button>
            <button style={buttonStyle} onClick={claimRewards}>Claim</button>
          </div>
          {estimates && (
            <div style={{ marginTop: '1rem' }}>
              <p>📆 Daily: {estimates.daily} BRANI</p>
              <p>📅 Monthly: {estimates.monthly} BRANI</p>
              <p>📈 Yearly: {estimates.yearly} BRANI</p>
            </div>
          )}
          <button style={{ ...buttonStyle, marginTop: "1rem" }} onClick={calculateEstimate}>Estimate Rewards</button>
        </div>

        {/* Proposal Section */}
        <div style={sectionStyle}>
          <h2>🧠 Proposal Dashboard</h2>
          {eligible ? (
            <form onSubmit={handleSubmitProposal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea rows="4" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <button type="button" onClick={handleSummarize} style={{ ...buttonStyle, backgroundColor: "#00bfff", alignSelf: "flex-start" }}>🧠 Summarize</button>
              <p>{summary}</p>
              <button type="submit" style={buttonStyle}>Submit</button>
            </form>
          ) : (
            <p>❌ You need <strong>≥10000+ BRANI</strong> to propose or vote.</p>
          )}

          <h3>📜 Active Proposals</h3>
          {proposals.length === 0 ? (
            <p>📭 No proposals yet.</p>
          ) : (
            proposals.map((p, i) => (
              <div key={i} style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "1rem" }}>
                <h4>{p.title}</h4>
                <p>{p.summary}</p>
                <p><strong>Votes:</strong> {p.votes}</p>
                <p><strong>Progress:</strong> {quorumPercent(p.votes)}%</p>

                {eligible && p.aiReview && !p.voters?.includes(account) && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button style={{ ...buttonStyle, backgroundColor: '#4caf50' }} onClick={() => handleVote(i, true)}>🟩 Vote For</button>
                    <button style={{ ...buttonStyle, backgroundColor: '#f44336' }} onClick={() => handleVote(i, false)}>🟨 Vote Against</button>
                  </div>
                )}

                {p.aiReviewed && (
                  <div style={{ marginTop: '10px' }}>
                    <p>✅ <strong>AI Review:</strong> {p.reviewDecision}</p>
                    <p>🧠 <em>{p.reviewReason}</em></p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Governance History Log */}
        <div style={sectionStyle}>
          <h2>📚 AI Governance History Log</h2>
          {historyLog.length === 0 ? (
            <p>📜 No log entries yet.</p>
          ) : (
            <HistoryLog entries={historyLog} />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
