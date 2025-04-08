import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { sha3_256 } from 'js-sha3';

const getLibrary = (provider) => new ethers.providers.Web3Provider(provider);

ReactDOM.createRoot(document.getElementById('root')).render(
  (
    <React.StrictMode>
      <Web3ReactProvider getLibrary={getLibrary}>
        <App />
      </Web3ReactProvider>
    </React.StrictMode>
  )
);