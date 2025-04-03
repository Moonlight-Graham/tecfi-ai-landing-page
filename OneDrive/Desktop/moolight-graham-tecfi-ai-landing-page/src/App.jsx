import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import WalletConnect from './WalletConnect';

// This function converts a provider into a Web3Provider for ethers.js
function getLibrary(provider) {
  return new Web3Provider(provider);
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>🚀 Welcome to TecFi AI DApp</h1>
        <WalletConnect />
      </div>
    </Web3ReactProvider>
  );
};

export default App;
