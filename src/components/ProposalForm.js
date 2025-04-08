import React, { useState } from "react";

const ProposalForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submitProposal = () => {
    const newProposal = {
      title,
      description,
      votes: 0,
      aiDecision: null,
    };

    onSubmit(newProposal); // send to parent (Dashboard)
    setTitle("");
    setDescription("");
  };

  return (
    <div>
      <h2>🗳️ Submit a Proposal</h2>
      <input
        type="text"
        placeholder="Proposal Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />
      <textarea
        placeholder="Describe your idea..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        cols={40}
      />
      <br /><br />
      <button onClick={submitProposal}>🚀 Submit Proposal</button>
    </div>
  );
};

export default ProposalForm;

