import React from "react";

const Landing = ({ connectWallet }) => {
  console.log("connectWallet prop:", connectWallet);
  
  return (
    <div
  style={{
    minHeight: "100vh",
    background: "linear-gradient(to right, #f2f4f8, #e6ecf3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start", // <- shift content toward top
    paddingTop: "4rem",       // <- fine-tune vertical position
    padding: "2rem",
  }}
>
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <img
          src="./tecfiai-icon-32x32.svg"
          alt="TecfiAI Icon"
          width="96"
          height="96"
          style={{ marginBottom: "0.5rem" }}
        />
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#111" }}>
          TECFI AI Governance DApp
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "1.5rem" }}>
          This is the official site for TecFi AI.
        </p>

        <p style={{ fontSize: "1rem", color: "#333", marginBottom: "1rem" }}>
          🔑 Connect your wallet to begin:
        </p>

        <button
  onClick={connectWallet}
  onMouseOver={(e) => (e.target.style.background = "#003f99")}
  onMouseOut={(e) => (e.target.style.background = "#0052cc")}
  style={{
    padding: "0.8rem 2rem",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    color: "#fff",
    background: "#0052cc",
    boxShadow: "0 4px 12px rgba(0, 82, 204, 0.3)",
    transition: "background 0.3s ease",
    cursor: "pointer",
  }}
>
  🔐 Connect Wallet
</button>
      </div>
    </div>
  );
};

export default Landing;