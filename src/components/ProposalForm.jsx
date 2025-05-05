import React from 'react';

const ProposalForm = ({ title, description, setTitle, setDescription, submitProposal }) => {
  const handleSubmit = () => {
    // Ensure title and description are provided before submitting
    if (!title.trim() || !description.trim()) {
      alert('Please enter both a title and description.');
      return;
    }
    submitProposal(); // call the function passed as prop
  };

  return (
    <div
      style={{
        background: '#111827',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 0 10px #7c3aed',
        maxWidth: '700px',
        margin: '2rem auto',
        color: '#e0e0e0',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          marginBottom: '1rem',
          color: '#c084fc',
          textAlign: 'center',
          textShadow: '0 0 8px #c084fc',
        }}
      >
        📝 Submit a Proposal
      </h2>

      <input
        type="text"
        placeholder="Proposal Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          marginBottom: '1rem',
          borderRadius: '8px',
          border: '1px solid #7c3aed',
          background: '#1f2937',
          color: '#fff',
          outline: 'none',
        }}
      />

      <textarea
        placeholder="Describe your idea..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          marginBottom: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #7c3aed',
          background: '#1f2937',
          color: '#fff',
          outline: 'none',
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: '#7c3aed',
          color: '#fff',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'block',
          margin: '0 auto',
          boxShadow: '0 0 10px #7c3aed',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#9f7aea')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#7c3aed')}
      >
        🚀 Submit Proposal
      </button>
    </div>
  );
};

export default ProposalForm;
