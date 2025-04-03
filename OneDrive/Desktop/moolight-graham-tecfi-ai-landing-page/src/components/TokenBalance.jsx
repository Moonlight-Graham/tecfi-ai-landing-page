import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ABI from '../abis/TecFiAI.json';

const TOKEN_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE'; // ⬅️ Replace this with your Sepolia contract address

const TokenBalance = ({ account }) => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account) return;
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(TOKEN_ADDRESS, ABI, provider);
        const decimals = await contract.decimals();
        const raw = await contract.balanceOf(account);
        const formatted = ethers.utils.formatUnits(raw, decimals);
        setBalance(formatted);
      } catch (error) {
        console.error('Balance fetch failed:', error);
      }
    };

    fetchBalance();
  }, [account]);

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>💰 Your TECFI Balance:</h3>
      {balance !== null ? <p>{balance} TECFI</p> : <p>Loading...</p>}
    </div>
  );
};

export default TokenBalance;
