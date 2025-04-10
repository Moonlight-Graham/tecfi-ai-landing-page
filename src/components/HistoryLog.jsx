import React, { useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient'; 

const HistoryLog = () => {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      const { data, error } = await supabase.from('HistoryLog').select('*').order('id', { ascending: false });
      if (error) {
        console.error('Error fetching history log:', error.message);
      } else {
        setLogData(data);
      }
      setLoading(false);
    };

    fetchLog();
  }, []);

  if (loading) return <p>Loading history...</p>;

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h3>📜 Governance History Log</h3>
      {logData.length === 0 ? (
        <p>No log entries yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Decision</th>
              <th style={thStyle}>Reason</th>
            </tr>
          </thead>
          <tbody>
            {logData.map((entry) => (
              <tr key={entry.id}>
                <td style={tdStyle}>{entry.id}</td>
                <td style={tdStyle}>{entry.title}</td>
                <td style={tdStyle}>{entry.description}</td>
                <td style={tdStyle}>{entry.decision}</td>
                <td style={tdStyle}>{entry.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  border: '1px solid #ccc',
  padding: '0.5rem',
  backgroundColor: '#f0f0f0',
  textAlign: 'left'
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '0.5rem'
};

export default HistoryLog;


