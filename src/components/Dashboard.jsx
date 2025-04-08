import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import TokenBalance from "./TokenBalance";
import StakingDashboard from "./StakingDashboard";
import tokenABI from "../abi/TecFiTokenABI.json";

const TOKEN_ADDRESS = "0xEc34Fd8C49F0F87266c45e296CDC717c52D7B2e9";
const QUORUM_TOKENS = 80000000; // 4% of 2B

const Dashboard = ({ account }) => {
  const [balance, setBalance] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [votes, setVotes] = useState({}); // proposalIndex: voteCount

  const eligible = balance >= 40000;

  // Fetch TECFI balance
  const fetchBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(TOKEN_ADDRESS, tokenABI, provider);
      const rawBalance = await contract.balanceOf(account);
      const decimals = await contract.decimals();
      const formatted = parseFloat(ethers.utils.formatUnits(rawBalance, decimals));
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
    // Simulated GPT summary
    const fakeSummary = description.length > 100
      ? description.slice(0, 100) + "..."
      : description;
    setSummary("🧠 Summary: " + fakeSummary);
  };

  // Add new proposal
  const handleSubmitProposal = (e) => {
    e.preventDefault();
    const newProposal = {
      title,
      description,
      summary,
      votes: 0,
      creator: account,
    };
    setProposals([...proposals, newProposal]);
    setTitle("");
    setDescription("");
    setSummary("");
  };

  // Vote on a proposal
  const handleVote = (index) => {
    const updated = [...proposals];
    updated[index].votes += balance;
    setProposals(updated);
	const [aiDecisions, setAiDecisions] = useState({});
  };

  // Quorum bar helper
  const quorumPercent = (votes) => ((votes / QUORUM_TOKENS) * 100).toFixed(1);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🧠 TECFI AI DAO Dashboard</h1>
      <p><strong>Wallet:</strong> {account}</p>
      <p><strong>Your TECFI Balance:</strong> {balance?.toLocaleString()} TECFI</p>

      <hr style={{ margin: "2rem 0" }} />

      <TokenBalance account={account} />
      <StakingDashboard account={account} />

      <hr style={{ margin: "2rem 0" }} />

      <h2>🗳️ Governance</h2>
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
          <button type="button" onClick={handleSummarize}>
            🤖 Generate Summary
          </button>
          {summary && <p style={{ marginTop: "8px" }}>{summary}</p>}
          <button type="submit" style={{ marginTop: "10px" }}>
            ➕ Submit Proposal
          </button>
        </form>
      ) : (
        <p>🔐 You need 40,000+ TECFI to create proposals or vote.</p>
      )}

      <h3>📋 Live Proposals</h3>
      {proposals.length === 0 ? (
        <p>No proposals yet.</p>
      ) : (
        proposals.map((p, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h4>{p.title}</h4>
            <p>{p.description}</p>
            {p.summary && <p><em>{p.summary}</em></p>}
            <p><strong>Votes:</strong> {p.votes.toLocaleString()}</p>
            <p><strong>Quorum Progress:</strong> {quorumPercent(p.votes)}%</p>
            {eligible && (
              <button onClick={() => handleVote(i)}
  style={{
    color: "#1a1a1a",
    fontWeight: "600",
    backgroundColor: "#e6f7e6",
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>✅ Vote Approve (1 token = 1 vote)</button>onClick={() => handleVote(i)}
  style={{
    color: "#1a1a1a",
    fontWeight: "600",
    backgroundColor: "#ffe6e6",
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>
  ❌ Vote Against
</button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
