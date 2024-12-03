import React, { useState } from "react";
import { ethers } from "ethers"; // Ensure ethers is imported

const CreateProject = ({ contract, account }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      if (!contract) {
        alert("Smart contract not loaded.");
        return;
      }

      // Convert amount from ETH to Wei
      const amountInWei = ethers.parseEther(amount);

      // Call the createProject function with name, description, and amount
      const tx = await contract.createProject(name, description, amountInWei);
      await tx.wait();

      setMessage("Project created successfully!");
      setName("");
      setDescription("");
      setAmount("");
    } catch (error) {
      console.error(error);
      setMessage("Error creating project.");
    }
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Create a New Project</h3>
      <form onSubmit={handleCreateProject} style={styles.form}>
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={styles.textarea}
        />
        {/* Removed Freelancer Input */}
        <input
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={styles.input}
          min="0"
          step="0.01"
        />
        <button type="submit" style={styles.button}>
          Create Project
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "500px",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    fontSize: "16px",
  },
  textarea: {
    padding: "10px",
    margin: "10px 0",
    fontSize: "16px",
    height: "100px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
  },
};

export default CreateProject;
