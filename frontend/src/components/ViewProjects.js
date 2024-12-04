import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ViewProjects = ({ contract, account }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      if (!contract) return;

      try {
        const projectCount = await contract.nextProjectId();
        const allProjects = [];

        for (let i = 0; i < projectCount; i++) {
          const project = await contract.projects(i);
          // Only show projects that are not yet accepted
          if (project.client === ethers.ZeroAddress) {
            allProjects.push(project);
          }
        }

        setProjects(allProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [contract]);

  const openModal = (project) => {
    setSelectedProject(project);
    setIsOpen(true);
    setMessage("");
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedProject(null);
  };

  const handleBuy = async () => {
    if (!contract || !selectedProject) return;

    try {
      setBuying(true);
      const tx = await contract.acceptTerms(selectedProject.id, {
        value: selectedProject.amount,
      });
      await tx.wait();
      setMessage("Project accepted successfully!");
      setBuying(false);
      closeModal();
      // Refresh the project list
      const projectCount = await contract.nextProjectId();
      const allProjects = [];

      for (let i = 0; i < projectCount; i++) {
        const project = await contract.projects(i);
        if (project.client === ethers.ZeroAddress) {
          allProjects.push(project);
        }
      }

      setProjects(allProjects);
    } catch (error) {
      console.error("Error accepting project:", error);
      setMessage("Error accepting project.");
      setBuying(false);
    }
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>All Available Projects</h3>
      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Freelancer</th>
              <th>Amount (ETH)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.id.toString()}</td>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{project.freelancer}</td>
                <td>{ethers.formatEther(project.amount)}</td>
                <td>
                  <button
                    style={styles.button}
                    onClick={() => openModal(project)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Project Details */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Project Details"
        style={customStyles}
      >
        {selectedProject && (
          <div>
            <h2>Project Details</h2>
            <p>
              <strong>ID:</strong> {selectedProject.id.toString()}
            </p>
            <p>
              <strong>Name:</strong> {selectedProject.name}
            </p>
            <p>
              <strong>Description:</strong> {selectedProject.description}
            </p>
            <p>
              <strong>Freelancer:</strong> {selectedProject.freelancer}
            </p>
            <p>
              <strong>Amount:</strong>{" "}
              {ethers.formatEther(selectedProject.amount)} ETH
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedProject.isAccepted ? "Accepted" : "Open"}
            </p>
            {selectedProject.deadline > 0 && (
              <p>
                <strong>Deadline:</strong>{" "}
                {new Date(selectedProject.deadline * 1000).toLocaleString()}
              </p>
            )}
            {selectedProject.isDisputed && (
              <p>
                <strong>Dispute Status:</strong> Disputed
              </p>
            )}
            {message && <p>{message}</p>}
            <button
              onClick={handleBuy}
              style={styles.buyButton}
              disabled={buying}
            >
              {buying ? "Processing..." : "Buy/Accept Project"}
            </button>
            <button onClick={closeModal} style={styles.cancelButton}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  button: {
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
  },
  buyButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    marginRight: "10px",
  },
  cancelButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "gray",
    color: "white",
    border: "none",
  },
};

// Custom styles for the modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    width: "90%",
  },
};

export default ViewProjects;
