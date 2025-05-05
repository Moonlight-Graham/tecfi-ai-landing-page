import React from 'react';

export default function LiveStats({ ethRaised }) {
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#FAFBFC',
      borderRadius: '1rem',
      maxWidth: '600px',
      margin: '2rem auto',
      boxShadow: '0 0 10px #22d3ee55'
    }}>
      <h3 style={{ marginBottom: '10px', color: '#222' }}>📈 Live Presale Stats</h3>

      <p style={{ fontSize: '16px', marginBottom: '8px' }}>
        <strong>Total ETH Raised:</strong> {parseFloat(ethRaised).toFixed(2)} ETH
      </p>
      <p style={{ fontSize: '16px', marginBottom: '8px' }}>
        <strong>XNAPZ Tokens Sold:</strong> {(parseFloat(ethRaised) * 150000).toLocaleString()} XNAPZ
      </p>
      <p style={{ fontSize: '16px', marginBottom: '12px' }}>
        <strong>Presale Target:</strong> 335 ETH
      </p>

      {/* Progress Bar */}
      <div style={{
        background: '#e0e0e0',
        borderRadius: '50px',
        overflow: 'hidden',
        height: '16px',
        width: '100%',
        maxWidth: '365px',
        margin: '20px auto'
      }}>
        <div style={{
          width: `${Math.min((parseFloat(ethRaised) / 350) * 100, 100)}%`, // <-- Fixed to match 350 ETH target
          background: '#4caf50',
          height: '100%',
          transition: 'width 0.5s ease'
        }}></div>
      </div>
    </div>
  );
}
