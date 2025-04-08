import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import stakingABI from "../abi/TecFiStakingABI.json";

const stakingAddress = "0x585CD4B832591C96D35135f3c66c9bb7FFA1F4B6"; // Sepolia staking contract

const StakingDashboard = ({ account }) => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [staked, setStaked] = useState("0");
  const [reward, setReward] = useState("0");
  const [inputAmount, setInputAmount] = useState("");
  const [estimates, setEstimates] = useState(null);

  // Setup provider and contract
  useEffect(() => {
    if (!account || typeof window.ethereum === "undefined") return;

    const web3Provider = new ethers.BrowserProvider(window.ethereum);
    const contractInstance = new ethers.Contract(stakingAddress, stakingABI, web3Provider);

    setProvider(web3Provider);
    setContract(contractInstance);
  }, [account]);

  // Load staked + reward
  useEffect(() => {
    const loadStakingInfo = async () => {
      if (!contract || !account) return;

      try {
        const staked = await contract.stakedBalance(account);
        const reward = await contract.calculateReward(account);

        setStaked(ethers.formatUnits(staked, 18));
        setReward(ethers.formatUnits(reward, 18));
      } catch (error) {
        console.error("Staking info error:", error);
      }
    };

    loadStakingInfo();
  }, [contract, account]);

  // Handlers
  const stake = async () => {
    if (!provider || !contract || !inputAmount) return;

    const signer = await provider.getSigner();
    const stakeWithSigner = contract.connect(signer);
    const amount = ethers.parseUnits(inputAmount, 18);

    try {
      const tx = await stakeWithSigner.stake(amount);
      await tx.wait();
      alert("Staked successfully!");
    } catch (error) {
      console.error("Stake error:", error);
    }
  };

  const unstake = async () => {
    if (!provider || !contract) return;

    const signer = await provider.getSigner();
    const unstakeWithSigner = contract.connect(signer);

    try {
      const tx = await unstakeWithSigner.unstake();
      await tx.wait();
      alert("Unstaked successfully!");
    } catch (error) {
      console.error("Unstake error:", error);
    }
  };

  const claimRewards = async () => {
    if (!provider || !contract) return;

    const signer = await provider.getSigner();
    const claimWithSigner = contract.connect(signer);

    try {
      const tx = await claimWithSigner.claimRewards();
      await tx.wait();
      alert("Rewards claimed!");
    } catch (error) {
      console.error("Claim error:", error);
    }
  };

  const calculateEstimate = () => {
    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) return;

    const apy = 2.1;
    const yearly = amount * apy;
    const monthly = yearly / 12;
    const daily = yearly / 365;

    setEstimates({
      daily: daily.toFixed(2),
      monthly: monthly.toFixed(2),
      yearly: yearly.toFixed(2),
    });
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.sectionTitle}>🔥 TECFI Staking Dashboard</h2>
      <p><strong>Wallet:</strong> {account}</p>
      <p><strong>Currently Staked:</strong> {staked} TECFI</p>
      <p><strong>Reward:</strong> {reward} TECFI</p>

      <div style={styles.row}>
        <input
          type="number"
          placeholder="Enter amount to stake"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          style={styles.input}
        />
        <button onClick={stake} style={styles.button}>Stake</button>
        <button onClick={unstake} style={styles.button}>Unstake</button>
        <button onClick={claimRewards} style={styles.button}>Claim Rewards</button>
      </div>

      {/* Estimate Reward Section */}
      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        <h3 style={styles.sectionTitle}>📈 Estimate Your Rewards</h3>
        <button onClick={calculateEstimate} style={styles.secondaryButton}>Calculate from input</button>
        {estimates && (
          <div style={{ marginTop: "1rem" }}>
            <p>💰 <strong>Daily:</strong> {estimates.daily} TECFI</p>
            <p>📅 <strong>Monthly:</strong> {estimates.monthly} TECFI</p>
            <p>📆 <strong>Yearly:</strong> {estimates.yearly} TECFI</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StakingDashboard;

const styles = {
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    margin: "2rem auto",
    maxWidth: "600px",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#333",
  },
  row: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
    flexWrap: "wrap",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    flex: "1",
  },
  button: {
    backgroundColor: "#1e90ff",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
  },
  secondaryButton: {
    backgroundColor: "#eee",
    color: "#111",
    border: "1px solid #ccc",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    marginTop: "0.5rem",
    cursor: "pointer",
  },
};


