import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

const WalletConnect = () => {
  const { active, account, activate } = useWeb3React();

  const connect = async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log('Connection error:', ex);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>🚀 Welcome to Xynapz Coin dApp</h1>
      {active ? (
        <p>✅ Connected: {account}</p>
      ) : (
        <button onClick={connect} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;


