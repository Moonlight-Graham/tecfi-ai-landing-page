import { useEffect, useState } from 'react';
import supabase from './supabaseClient';

const HistoryLog = () => {
  const [logEntries, setLogEntries] = useState([]);

  useEffect(() => {
    const fetchLog = async () => {
      const { data, error } = await supabase
        .from('HistoryLog')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history log:', error);
      } else {
        setLogEntries(data);
      }
    };

    fetchLog();
  }, []);

  return (
    <div>
      {logEntries.length === 0 ? (
        <p>No log entries yet.</p>
      ) : (
        logEntries.map((entry, idx) => (
          <div key={idx} style={{ backgroundColor: '#fdf6e3', padding: '10px', marginBottom: '1rem', borderRadius: '8px' }}>
            <h4>{entry.title}</h4>
            <p><strong>🕒</strong> {new Date(entry.created_at).toLocaleString()}</p>
            <p><strong>🧠 Decision:</strong> {entry.decision}</p>
            <p><strong>📝 Reason:</strong> {entry.reason}</p>
            <p><em>{entry.description}</em></p>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryLog;



