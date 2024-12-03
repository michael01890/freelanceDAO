import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { UserContext } from "../components/UserContext";
import freelanceDAOAbi from "../contractABI_FreelanceDAO.json"; // Updated ABI
import { freelanceDAOAddress } from "../contractAddresses"; // Updated contract address
import CreateProject from "../components/CreateProject";
import ViewProjects from "../components/ViewProjects";
import ProjectsCreated from "../components/ProjectsCreated";
import ProjectsBought from "../components/ProjectsBought";

const Dashboard = () => {
  const { account } = useContext(UserContext);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const freelanceDAO = new ethers.Contract(
          freelanceDAOAddress,
          freelanceDAOAbi,
          signer
        );
        setContract(freelanceDAO);
      }
    };
    init();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <CreateProject contract={contract} account={account} />
      <ViewProjects contract={contract} account={account} />
      <ProjectsCreated contract={contract} account={account} />
      <ProjectsBought contract={contract} account={account} />
    </div>
  );
};

export default Dashboard;
