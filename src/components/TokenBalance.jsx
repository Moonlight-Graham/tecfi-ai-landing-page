import React from "react";
import './TokenBalance.css';

function TokenBalance({ account, balance }) {
  return (
    <div style={styles.container}>
    </div>
  );
}

const fetchBalance = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(tokenAddress, tokenABI, provider);
    const rawBalance = await contract.balanceOf(account);
    const decimals = await contract.decimals();
    const formatted = ethers.utils.formatUnits(rawBalance, decimals);
    setBalance(formatted);
  } catch (error) {
    console.error("Error fetching balance:", error);
    setBalance("Error");
  }
};

const styles = {
  container: {
    marginBottom: "2rem",
    textAlign: "center",
  },
  card: {
    display: "inline-block",
    padding: "1rem 2rem",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
  },
};

export default TokenBalance;




