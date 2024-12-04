import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const ProjectsCreated = ({ contract, account }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchCreatedProjects = async () => {
      if (!contract || !account) return;

      try {
        const projectCount = await contract.nextProjectId();
        const createdProjects = [];

        for (let i = 0; i < projectCount; i++) {
          const project = await contract.projects(i);
          if (project.freelancer.toLowerCase() === account.toLowerCase()) {
            createdProjects.push(project);
          }
        }

        setProjects(createdProjects);
      } catch (error) {
        console.error("Error fetching created projects:", error);
      }
    };

    fetchCreatedProjects();
  }, [contract, account]);

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Projects You Created</h3>
      {projects.length === 0 ? (
        <p>You have not created any projects.</p>
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
                <td>
                  {project.isAccepted
                    ? project.isCompleted
                      ? "Completed"
                      : "Accepted"
                    : "Open"}
                </td>
                <td>
                  {/* Future actions: Mark as Completed, Raise Dispute */}
                  {project.isAccepted && !project.isCompleted && (
                    <button
                      style={styles.button}
                      onClick={() => {
                        /* Implement Mark as Completed */
                      }}
                    >
                      Mark as Completed
                    </button>
                  )}
                  {!project.isAccepted && (
                    <button
                      style={styles.button}
                      onClick={() => {
                        /* Implement Raise Dispute */
                      }}
                    >
                      Raise Dispute
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

export default ProjectsCreated;
