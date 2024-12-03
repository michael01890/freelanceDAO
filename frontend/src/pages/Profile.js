import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../components/UserContext";
import { ethers } from "ethers";
import contractABI from "../contractABI.json"; // Ensure you have this file

const Profile = () => {
  const { account } = useContext(UserContext);
  const [profile, setProfile] = useState({ name: "", bio: "", avatar: "" });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  // Replace with your contract's deployed address
  const contractAddress = "<DEPLOYED_CONTRACT_ADDRESS>";

  useEffect(() => {
    const fetchProfile = async () => {
      if (window.ethereum && account) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const freelanceDAO = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const userProfile = await freelanceDAO.getProfile(account);
        setProfile(userProfile);
      }
    };
    fetchProfile();
  }, [account, contractAddress]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const freelanceDAO = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const tx = await freelanceDAO.createOrUpdateProfile(
        profile.name,
        profile.bio,
        profile.avatar
      );
      await tx.wait();

      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error(error);
      setMessage("Error updating profile.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Profile</h2>
      {editing ? (
        <form onSubmit={handleUpdateProfile} style={styles.form}>
          <input
            type="text"
            placeholder="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
            style={styles.input}
          />
          <textarea
            placeholder="Bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            required
            style={styles.textarea}
          />
          <input
            type="text"
            placeholder="Avatar URL"
            value={profile.avatar}
            onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Save Profile
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            style={{ ...styles.button, backgroundColor: "gray" }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {profile.name || "N/A"}
          </p>
          <p>
            <strong>Bio:</strong> {profile.bio || "N/A"}
          </p>
          <p>
            <strong>Avatar:</strong>{" "}
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" width="100" />
            ) : (
              "N/A"
            )}
          </p>
          <button onClick={() => setEditing(true)} style={styles.button}>
            Edit Profile
          </button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
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
    marginTop: "10px",
  },
};

export default Profile;
