// src/hooks/useWalletInfo.jsx

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import tokenABI from '../abi/XynapzCoinABI.json';
import presaleABI from '../abi/XynapzPresaleABI.json';

const tokenAddress = '0x72f068CCBfDd2516F6Fe193d41A9019C4305E0A8';
const presaleAddress = '0x1D8DA8a577C3012f164695393fcfDa7C308622939';

function useWalletInfo() {
  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [presaleContract, setPresaleContract] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [ethRaised, setEthRaised] = useState('0');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const userSigner = await browserProvider.getSigner();
        const userAddress = await userSigner.getAddress();

        const token = new ethers.Contract(tokenAddress, tokenABI, userSigner);
        const presale = new ethers.Contract(presaleAddress, presaleABI, userSigner);

        const balance = await token.balanceOf(userAddress);
        const symbol = await token.symbol();

        setProvider(browserProvider);
        setSigner(userSigner);
        setAddress(userAddress);
        setTokenBalance(ethers.formatUnits(balance, 6)); // 6 decimals
        setTokenSymbol(symbol);
        setPresaleContract(presale);

        const raised = await browserProvider.getBalance(presaleAddress);
        setEthRaised(ethers.formatEther(raised));
      } catch (err) {
        console.error('Wallet connection failed:', err);
      }
    } else {
      alert('Please install MetaMask to use this dApp.');
    }
  };

  const fetchEthPrice = async () => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      const data = await res.json();
      setEthPrice(data.ethereum.usd);
    } catch (err) {
      console.error('Error fetching ETH price:', err);
    }
  };

  useEffect(() => {
    connectWallet();
    fetchEthPrice();

    const priceInterval = setInterval(fetchEthPrice, 60000); // refresh every 60s
    return () => clearInterval(priceInterval);
  }, []);

  return {
    address,
    signer,
    provider,
    tokenBalance,
    tokenSymbol,
    presaleContract,
    ethPrice,
    ethRaised,
    connectWallet
  };
}

export default useWalletInfo;