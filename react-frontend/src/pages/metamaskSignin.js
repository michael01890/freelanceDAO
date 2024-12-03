// src/components/MetaMaskSignin.js
import React, { useState } from 'react';
import { ethers } from 'ethers'; // Ensure correct import

const MetaMaskSignin = () => {
    const [account, setAccount] = useState(null);

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                // Create a new provider using BrowserProvider
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner()
                
                // Request account access from MetaMask
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                // Get the connected account
                const userAccount = await signer.getAddress();
                setAccount(userAccount);
                alert('Wallet connected: ' + userAccount);
            } else {
                alert('MetaMask is not installed. Please install it to use this feature.');
            }
        } catch (error) {
            console.error(error);
            alert('Error connecting to MetaMask. Please try again.');
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Sign In Using MetaMask</h2>
            {account ? (
                <p>Connected Account: {account}</p>
            ) : (
                <button onClick={connectWallet}>Connect MetaMask</button>
            )}
        </div>
    );
};

export default MetaMaskSignin;
