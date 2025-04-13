import React, { useEffect, useState } from "react";
import { aiReviewProposal } from "../utils/aiReview";
import { supabase } from './supabaseClient';
import './ProposalDashboard.css';


const QUORUM_THRESHOLD = { useState }

const ProposalDashboard = ({ account, tokenBalance }) => {
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState("");
  const [voteTallies, setVoteTallies] = useState({});
  const [aiDecisions, setAiDecisions] = useState({});
  const [voted, setVoted] = useState({});

  // Token-based access
  const canPropose = parseFloat(tokenBalance) >= 250;
  const canVote = parseFloat(tokenBalance) > 250;

  // Add new proposal
  const handleSubmitProposal = () => {
    if (!canPropose) {
      alert("You need at least 250 TECFI to create proposals.");
      return;
    }
    if (!newProposal.trim()) return;

    const newEntry = {
      id: Date.now(),
      text: newProposal,
      submittedBy: account,
      timestamp: Date.now(),
    };

    setProposals([...proposals, newEntry]);
    setNewProposal("");
  };

  // Vote handler
  const vote = (proposalId, type) => {
    if (!canVote || voted[proposalId]) return;

    const amount = parseFloat(tokenBalance);
    setVoteTallies((prev) => ({
      ...prev,
      [proposalId]: {
        for: (prev[proposalId]?.for || 0) + (type === "for" ? amount : 0),
        against: (prev[proposalId]?.against || 0) + (type === "against" ? amount : 0),
      },
    }));

    setVoted((prev) => ({ ...prev, [proposalId]: true }));
  };

  // Check quorum and auto-submit to AI
  const checkAndSendToAI = async (proposal) => {
    const tally = voteTallies[proposal.id];
    const totalVotes = (tally?.for || 0) + (tally?.against || 0);

    if (totalVotes >= QUORUM_THRESHOLD && !aiDecisions[proposal.id]) {
      const decision = await aiReviewProposal(proposal.text);
      setAiDecisions((prev) => ({ ...prev, [proposal.id]: decision }));
    }
  };

  useEffect(() => {
    proposals.forEach(checkAndSendToAI);
  }, [voteTallies]);

  return (
    <div style={styles.container}>
      <h2>🗳️ TECFI Governance Dashboard</h2>

      <div style={styles.section}>
        <h4>📢 Submit a Proposal</h4>
        {canPropose ? (
          <>
            <textarea
              rows="3"
              value={newProposal}
              onChange={(e) => setNewProposal(e.target.value)}
              style={styles.textarea}
              placeholder="Propose something epic..."
            />
            <br />
            <button onClick={handleSubmitProposal} style={styles.button}>
              ➕ Submit Proposal
            </button>
          </>
        ) : (
          <p style={{ color: "red" }}>🔐 40,000+ $TECFI required to submit a proposal.</p>
        )}
      </div>

      <div style={styles.section}>
        <h4>📋 Proposals</h4>
        {proposals.map((p) => {
          const tally = voteTallies[p.id] || { for: 0, against: 0 };
          const ai = aiDecisions[p.id];

const [history, setHistory] = useState([]);

useEffect(() => {
  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('history_log')
      .select('*')
      .order('timestamp', { ascending: false });

    if (!error) {
      setHistory(data);
    } else {
      console.error("Error fetching history:", error);
    }
  };

  fetchHistory();
}, []);

<div style={{ marginTop: "2rem" }}>
  <h3>📜 Past AI Decisions</h3>
  {history.length === 0 ? (
    <p>No past proposals yet.</p>
  ) : (
    <ul style={{ listStyle: "none", padding: 0 }}>
	
      {history.map((entry, index) => (
        <li key={index} style={{ 
          border: "1px solid #ccc", 
          borderRadius: "8px", 
          padding: "1rem", 
          marginBottom: "1rem",
          backgroundColor: entry.decision === "Approved" ? "#e6ffed" : "#ffe6e6"
        }}>
          <p><strong>📝 Proposal:</strong> {entry.proposal}</p>
          <p><strong>🤖 AI Decision:</strong> <span style={{ color: entry.decision === "Approved" ? "green" : "red" }}>{entry.decision}</span></p>
          <p><em>{entry.reason}</em></p>
          <p style={{ fontSize: "0.8rem", color: "#777" }}>🕓 {new Date(entry.timestamp).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  )}
</div>

          return (
            <div key={p.id} style={styles.proposalBox}>
              <p><strong>📝</strong> {p.text}</p>
              <p>✅ For: {tally.for.toLocaleString()} | ❌ Against: {tally.against.toLocaleString()}</p>

              {!ai ? (
                canVote && !voted[p.id] ? (
                  <>
                    <button onClick={() => handleVote(i)} className="vote-button vote-for">✅ Vote For</button>
                    <button onClick={() => handleVote(i)} className="vote-button vote-against">❌ Vote Against</button>
                  </>
                ) : (
                  <p style={{ fontStyle: "italic" }}>🕒 Waiting for quorum or AI decision...</p>
                )
              ) : (
                <div style={{ marginTop: "0.5rem", padding: "0.5rem", borderLeft: "4px solid #1e90ff" }}>
                  <p>🤖 <strong>AI Decision:</strong> <span style={{ color: ai.decision === "Approved" ? "green" : "red" }}>{ai.decision}</span></p>
                  <p style={{ fontStyle: "italic" }}>{ai.reason}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProposalDashboard;

const styles = {
  container: {
    marginTop: "2rem",
    padding: "2rem",
    background: "#fefefe",
    borderRadius: "10px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  section: {
    marginBottom: "2rem",
  },
  textarea: {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.5rem 1.2rem",
    marginTop: "0.5rem",
    backgroundColor: "#1e90ff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  proposalBox: {
    background: "#f9f9f9",
    border: "1px solid #eee",
    borderRadius: "6px",
    padding: "1rem",
    marginBottom: "1rem",
  },
  voteBtn: {
    marginRight: "0.5rem",
    padding: "0.4rem 1rem",
    backgroundColor: "#eee",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
