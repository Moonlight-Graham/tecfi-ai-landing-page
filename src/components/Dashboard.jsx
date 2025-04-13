import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import TokenBalance from "./TokenBalance";
import StakingDashboard from "./StakingDashboard";
import tokenABI from "../abi/TecFiTokenABI";

import HistoryLog from "../components/HistoryLog";

const TOKEN_ADDRESS = "0x0B642a9555dAfdBCB0303E30802a64261b4eBE7b";
const QUORUM_TOKENS = "60000";

const Dashboard = ({ account }) => {
  const [balance, setBalance] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [votes, setVotes] = useState({});
  const eligible = balance >= 250;

  // Fetch TECFI balance
  const fetchBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(TOKEN_ADDRESS, tokenABI, provider);
      const balance = await contract.balanceOf(account);
      const decimals = await contract.decimals();
      const formatted = parseFloat(ethers.utils.formatUnits(balance, decimals));
      setBalance(formatted);
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  };

  useEffect(() => {
    if (account) fetchBalance();
  }, [account]);

  // GPT Auto-summary (simulated)
  const handleSummarize = async () => {
    if (!description) return;
    const fakeSummary = description.length > 100
      ? description.slice(0, 100) + "..."
      : description;
    setSummary(`Summary: ${fakeSummary}`);
  };

  // Add new proposal
  const handleSubmitProposal = (e) => {
    e.preventDefault();
    const newProposal = {
      title,
      description,
      summary,
      creator: account,
      votes: 0,
    };
    setProposals([...proposals, newProposal]);
    setTitle("");
    setDescription("");
    setSummary("");
  };

  // Vote on a proposal
  const handleVote = (index) => {
    const updated = [...proposals];
    updated[index].votes += 1;
    setProposals(updated);
  };

  // Quorum bar helper
  const quorumPercent = (votes) => ((votes / QUORUM_TOKENS) * 100).toFixed(1);

  return (
    <div style={{ padding: ".2rem" }}>
      <h1>💎 TecFi AI DAO Dashboard 💎</h1>
      <p><strong>Connected Wallet:</strong> {account}</p>
      <p><strong>Your TECFI Balance:</strong> {balance?.toLocaleString()} TECFI</p>
      <hr style={{ margin: ".75rem 0" }} />
      <TokenBalance account={account} />
      <StakingDashboard account={account} />
      <hr style={{ margin: "2rem 0" }} />
      <h3>🗳️ Governance</h3>
      {eligible ? (
        <form onSubmit={handleSubmitProposal} style={{ marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="Proposal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
            required
          />
          <textarea
            placeholder="Proposal Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
            required
          />
          <button type="button" onClick={handleSummarize}>📝 Generate Summary</button>
          {summary && <p style={{ marginTop: "8px" }}>{summary}</p>}
          <button type="submit" style={{ marginTop: "10px" }}>Submit Proposal</button>
        </form>
      ) : (
        <p>💰 You need 250+ TECFI to create proposals or vote.</p>
      )}

      <h3>📜 Live Proposals</h3>
      {proposals.length === 0 ? (
        <p>No proposals yet.</p>
      ) : (
        proposals.map((p, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <h4>{p.title}</h4>
            <p>{p.summary}</p>
            <p><strong>Votes:</strong> {p.votes.toLocaleString()}</p>
            <p><strong>Progress:</strong> {quorumPercent(p.votes)}%</p>
            {eligible && (
              <button
                style={{ color: "#fff", backgroundColor: "#6f6e7e", fontWeight: "600", padding: "8px", borderRadius: "5px", cursor: "pointer" }}
                onClick={() => handleVote(i)}
              >
                Vote Approve (1 token = 1 vote)
              </button>
            )}
          </div>
        ))
      )}

      <h2>📜 History Log</h2>
      <HistoryLog />
    </div>
  );
};

export default Dashboard;
