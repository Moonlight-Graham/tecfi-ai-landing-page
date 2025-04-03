import React, { useState } from "react";

const dummyProposals = [
  {
    id: 1,
    title: "Burn 5% of unused tokens",
    votesFor: 321,
    votesAgainst: 42,
  },
  {
    id: 2,
    title: "Fund new AI research bot",
    votesFor: 211,
    votesAgainst: 30,
  },
];

const VoteDashboard = () => {
  const [votes, setVotes] = useState({});

  const handleVote = (id, type) => {
    setVotes((prev) => ({
      ...prev,
      [id]: type,
    }));
  };

  return (
    <div>
      <h2>Governance Proposals</h2>
      {dummyProposals.map((proposal) => (
        <div key={proposal.id} style={{ marginBottom: "20px" }}>
          <strong>{proposal.title}</strong>
          <div>
            <button
              onClick={() => handleVote(proposal.id, "for")}
              disabled={votes[proposal.id]}
            >
              👍 For ({proposal.votesFor})
            </button>
            <button
              onClick={() => handleVote(proposal.id, "against")}
              disabled={votes[proposal.id]}
              style={{ marginLeft: "10px" }}
            >
              👎 Against ({proposal.votesAgainst})
            </button>
          </div>
          {votes[proposal.id] && (
            <p>You voted {votes[proposal.id]} on this proposal.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default VoteDashboard;
