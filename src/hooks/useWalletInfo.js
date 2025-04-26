// src/hooks/useWalletInfo.js
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';

const PROJECT_ID = '65b1cf525724e2476d564c759ccf50f1'; // Your actual WalletConnect project ID

function useWalletInfo() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);

  const connectWallet = async () => {
    try {
      const wcProvider = new WalletConnectProvider({
        projectId: PROJECT_ID,
        chains: [1], // Ethereum Mainnet, change if needed
        showQrModal: true,
      });

      await wcProvider.enable();

      const ethersProvider = new ethers.BrowserProvider(wcProvider);
      const userSigner = await ethersProvider.getSigner();
      const userAddress = await userSigner.getAddress();

      setProvider(ethersProvider);
      setSigner(userSigner);
      setAddress(userAddress);
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  };

  return {
    provider,
    signer,
    address,
    connectWallet
  };
}

export default useWalletInfo;
