import React, { useState } from 'react';
import ProposalForm from './ProposalForm';
import { aiReviewProposal } from '../utils/aiReview';

const DemoDashboard = ({ walletAddress, tokenBalance }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitProposal = async () => {
    if (!title || !description) {
      alert('Please fill in both fields before submitting.');
      return;
    }

    setLoading(true);
    try {
      const proposalText = `Title: ${title}\n\nDescription: ${description}`;
      const aiResult = await aiReviewProposal(proposalText);
      setResult(aiResult);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission Error:', err);
      alert('Something went wrong during submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    backgroundColor: '#0b0b1f',
    color: '#e0e0e0',
    padding: '2rem',
    borderRadius: '16px',
    marginTop: '3rem',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    boxShadow: '0 0 20px #38bdf8',
  };

  const headingStyle = {
    color: '#38bdf8',
    fontSize: '28px',
    marginBottom: '1rem',
    textShadow: '0 0 8px #38bdf8',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>🧪 XNAPZ Demo Governance Dashboard</h2>

      {!walletAddress ? (
        <p>⚠️ Please connect your wallet to view the demo.</p>
      ) : tokenBalance < 500 ? (
        <p style={{ color: '#facd51' }}>
          ⚠️ You need at least <strong>500 XNAPZ</strong> to access the demo.
        </p>
      ) : submitted ? (
        <>
          <h3 style={{ color: result?.decision === 'Approved' ? '#4ade80' : '#f87171' }}>
            ✅ AI Decision: {result?.decision}
          </h3>
          <p style={{ marginTop: '1rem' }}>
            🧠 <strong>Reason:</strong> {result?.reason}
          </p>
        </>
      ) : (
        <ProposalForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          submitProposal={submitProposal}
        />
      )}

      {loading && <p style={{ marginTop: '1rem' }}>⏳ Submitting proposal for AI evaluation...</p>}
    </div>
  );
};

export default DemoDashboard;
