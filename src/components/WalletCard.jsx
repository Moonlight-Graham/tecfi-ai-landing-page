import React from "react";

const WalletCard = ({ account, tokenBalance, onDisconnect }) => {
  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        padding: "1rem",
        borderRadius: "12px",
        marginBottom: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div>
        <p><strong>Wallet:</strong> {account}</p>
        <p><strong>Balance:</strong> {tokenBalance} XNAPZ</p>
      </div>
      <button
        onClick={onDisconnect}
        style={{
          backgroundColor: "#ffe6e6",
          color: "#cc0000",
          fontWeight: "600",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        🔌 Disconnect Wallet
      </button>
    </div>
  );
};

export default WalletCard;
