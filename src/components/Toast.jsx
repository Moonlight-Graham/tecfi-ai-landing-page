import React from 'react';

export default function Toast({ message, type }) {
  if (!message) return null;

  const backgroundColor = type === 'success' ? '#4ade80' :
                           type === 'error' ? '#f87171' :
                           '#facc15'; // warning or default

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor,
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '10px',
      fontWeight: '600',
      zIndex: '9999',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    }}>
      {message}
    </div>
  );
}
