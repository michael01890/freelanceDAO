// frontend/src/components/ProjectsBought.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const ProjectsBought = ({ contract, account }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchBoughtProjects = async () => {
      if (!contract || !account) return;

      try {
        const projectCount = await contract.nextProjectId();
        const boughtProjects = [];

        for (let i = 0; i < projectCount; i++) {
          const project = await contract.projects(i);
          if (project.client.toLowerCase() === account.toLowerCase()) {
            boughtProjects.push(project);
          }
        }

        setProjects(boughtProjects);
      } catch (error) {
        console.error("Error fetching bought projects:", error);
      }
    };

    fetchBoughtProjects();
  }, [contract, account]);

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Projects You Bought</h3>
      {projects.length === 0 ? (
        <p>You have not bought any projects.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Amount (ETH)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.id.toString()}</td>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{ethers.formatEther(project.amount)}</td>
                <td>{project.isCompleted ? "Completed" : "Accepted"}</td>
                <td>
                  {project.isCompleted ? (
                    <button
                      style={styles.button}
                      onClick={() => {
                        /* Implement Review */
                      }}
                    >
                      Review
                    </button>
                  ) : (
                    <button
                      style={styles.button}
                      onClick={() => {
                        /* Implement Confirm Completion */
                      }}
                    >
                      Confirm Completion
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
    marginRight: "5px",
  },
};

export default ProjectsBought;
