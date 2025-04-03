// src/components/DaoGovernance.jsx

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import GOVERNOR_ABI from '../abis/GovernorABI.json'; // ← You’ll place your contract ABI here

const GOVERNOR_ADDRESS = "YOUR_GOVERNOR_CONTRACT_ADDRESS"; // 👈 Replace with your deployed Governor contract address

const DaoGovernance = () => {
  const [proposals, setProposals] = useState([]);
  const [proposalText, setProposalText] = useState('');
  const [voteId, setVoteId] = useState('');
  const [voteChoice, setVoteChoice] = useState(true); // true = For, false = Against
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [governor, setGovernor] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        const _signer = _provider.getSigner();
        const _governor = new ethers.Contract(GOVERNOR_ADDRESS, GOVERNOR_ABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setGovernor(_governor);
      }
    };
    init();
  }, []);

  const submitProposal = async () => {
    try {
      const tx = await governor.propose(
        [], [], [], // No direct call targets for now
        proposalText
      );
      await tx.wait();
      alert('✅ Proposal submitted!');
    } catch (err) {
      console.error(err);
      alert('⚠️ Failed to submit proposal');
    }
  };

  const castVote = async () => {
    try {
      const vote = voteChoice ? 1 : 0;
      const tx = await governor.castVote(voteId, vote);
      await tx.wait();
      alert('✅ Vote cast!');
    } catch (err) {
      console.error(err);
      alert('⚠️ Failed to vote');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h2>🗳️ TecFi AI DAO Governance</h2>

      <div style={{ margin: '20px' }}>
        <h4>📝 Create Proposal</h4>
        <textarea
          rows="4"
          cols="50"
          placeholder="Enter your proposal description..."
          onChange={(e) => setProposalText(e.target.value)}
        />
        <br />
        <button onClick={submitProposal}>Submit Proposal</button>
      </div>

      <div style={{ margin: '20px' }}>
        <h4>✅ Cast Vote</h4>
        <input
          type="number"
          placeholder="Proposal ID"
          onChange={(e) => setVoteId(e.target.value)}
        />
        <br />
        <label>
          <input
            type="radio"
            value={true}
            checked={voteChoice === true}
            onChange={() => setVoteChoice(true)}
          /> For
        </label>
        <label>
          <input
            type="radio"
            value={false}
            checked={voteChoice === false}
            onChange={() => setVoteChoice(false)}
          /> Against
        </label>
        <br />
        <button onClick={castVote}>Vote</button>
      </div>
    </div>
  );
};

export default DaoGovernance;
