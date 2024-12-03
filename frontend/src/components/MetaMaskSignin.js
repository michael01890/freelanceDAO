import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const MetaMaskSignin = () => {
  const [error, setError] = useState(null);
  const { setAccount } = useContext(UserContext);
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // Request account access from MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Create a new provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Get the connected account
        const userAccount = await signer.getAddress();
        setAccount(userAccount);
        alert("Wallet connected: " + userAccount);

        // Redirect to Dashboard
        navigate("/dashboard");
      } else {
        alert(
          "MetaMask is not installed. Please install it to use this feature."
        );
      }
    } catch (error) {
      console.error(error);
      setError("Error connecting to MetaMask. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Sign In Using MetaMask</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={connectWallet}>Connect MetaMask</button>
    </div>
  );
};

export default MetaMaskSignin;
