import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import tokenABI from "../abi/TecFiTokenABI.json";
import stakingABI from "../abi/TecFiStakingABI.json";
import HistoryLog from "./HistoryLog";


const TOKEN_ADDRESS = "0x0B642a9555dAfdBCB0303E30802a64261b4eBE7b";
const STAKING_ADDRESS = "0x6f8b2f84a82e3190cC631a4e593c7Ab8533f0a0";
const QUORUM_TOKENS = 60000;

const Dashboard = ({ account }) => {
  const [balance, setBalance] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [votes, setVotes] = useState({});
  const eligible = balance >= 250;

  const [provider, setProvider] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [staked, setStaked] = useState("0");
  const [reward, setReward] = useState("0");
  const [inputAmount, setInputAmount] = useState("");
  const [estimates, setEstimates] = useState(null);

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
        console.error("Failed to fetch balance:", err);
      }
    };
    fetchBalance();
  }, [account]);

  useEffect(() => {
    if (!account || typeof window.ethereum === "undefined") return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(STAKING_ADDRESS, stakingABI, provider);
    setProvider(provider);
    setStakingContract(contract);
  }, [account]);

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

  const stake = async () => {
    if (!provider || !stakingContract || !inputAmount) return;
    const signer = await provider.getSigner();
    const contract = stakingContract.connect(signer);
    const amount = ethers.utils.parseUnits(inputAmount, 6);
    try {
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
    const apy = 2.10;
    const yearly = amount * apy;
    const monthly = yearly / 12;
    const daily = yearly / 365;
    setEstimates({ daily: daily.toFixed(2), monthly: monthly.toFixed(2), yearly: yearly.toFixed(2) });
  };

  const handleSummarize = async () => {
    if (!description) return;
    const fakeSummary = description.length > 100 ? description.slice(0, 100) + "..." : description;
    setSummary(`Summary: ${fakeSummary}`);
  };

  const handleSubmitProposal = (e) => {
    e.preventDefault();
    const newProposal = { title, description, summary, creator: account, votes: 0 };
    setProposals([...proposals, newProposal]);
    setTitle("");
    setDescription("");
    setSummary("");
  };

  const handleVote = (index) => {
    const updated = [...proposals];
    updated[index].votes += 1;
    setProposals(updated);
  };

  const quorumPercent = (votes) => ((votes / QUORUM_TOKENS) * 100).toFixed(1);

  const sectionStyle = {
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    marginBottom: "2rem"
  };

  const buttonStyle = {
    padding: "10px 16px",
    background: "#4c6ef5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px"
  };

  return (
    <div style={{ padding: ".2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>💎 TecFi AI DAO Dashboard 💎</h1>
      <div style={sectionStyle}>
        <h2>💰 Staking Dashboard</h2>
        <p><strong>Wallet:</strong> {account}</p>
        <p><strong>Balance:</strong> {balance.toLocaleString()} TECFI</p>
        <p><strong>Currently Staked:</strong> {staked} TECFI</p>
        <p><strong>Reward:</strong> {reward} TECFI</p>
        <input type="number" placeholder="Enter amount" value={inputAmount} onChange={(e) => setInputAmount(e.target.value)} />
        <div style={{ marginTop: "1rem" }}>
          <button style={buttonStyle} onClick={stake}>Stake</button>
          <button style={buttonStyle} onClick={unstake}>Unstake</button>
          <button style={buttonStyle} onClick={claimRewards}>Claim</button>
        </div>
        {estimates && (
          <div style={{ marginTop: "1rem" }}>
            <p>📅 Daily: {estimates.daily} TECFI</p>
            <p>🗓️ Monthly: {estimates.monthly} TECFI</p>
            <p>📆 Yearly: {estimates.yearly} TECFI</p>
          </div>
        )}
        <button style={{ ...buttonStyle, marginTop: "1rem" }} onClick={calculateEstimate}>Estimate Rewards</button>
      </div>

      <div style={sectionStyle}>
        <h2>📜 Proposal Dashboard</h2>
        {eligible ? (
          <form onSubmit={handleSubmitProposal}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} required />
            <textarea placeholder="Description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: "8px" }} required />
            <button type="button" onClick={handleSummarize} style={{ ...buttonStyle, marginTop: "1rem" }}>🧠 Summarize</button>
            <p>{summary}</p>
            <button type="submit" style={{ ...buttonStyle, marginTop: "10px" }}>Submit</button>
          </form>
        ) : <p>🚫 You need 250+ TECFI to propose or vote.</p>}

        <h3>📂 Active Proposals</h3>
        {proposals.length === 0 ? <p>No proposals yet.</p> : (
          proposals.map((p, i) => (
            <div key={i} style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "1rem" }}>
              <h4>{p.title}</h4>
              <p>{p.summary}</p>
              <p><strong>Votes:</strong> {p.votes}</p>
              <p><strong>Progress:</strong> {quorumPercent(p.votes)}%</p>
              {eligible && <button style={buttonStyle} onClick={() => handleVote(i)}>✅ Vote</button>}
            </div>
          ))
        )}
      </div>

      <div style={sectionStyle}>
        <h2>📖 AI Governance History Log</h2>
        <HistoryLog />
      </div>
    </div>
  );
};

export default Dashboard;
