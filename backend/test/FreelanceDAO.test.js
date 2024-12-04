const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FreelanceDAO Contract", function () {
  let FreelanceDAO, freelanceDAO, owner, client, freelancer;

  beforeEach(async function () {
    // Deploy the contract
    FreelanceDAO = await ethers.getContractFactory("FreelanceDAO");
    freelanceDAO = await FreelanceDAO.deploy();
    await freelanceDAO.deployed();

    // Get test accounts
    const signers = await ethers.getSigners();
    owner = signers[0];
    client = signers[1];
    freelancer = signers[2];

    // Check balances
    console.log(
      "Owner balance:",
      ethers.utils.formatEther(await owner.getBalance())
    );
    console.log(
      "Client balance:",
      ethers.utils.formatEther(await client.getBalance())
    );
    console.log(
      "Freelancer balance:",
      ethers.utils.formatEther(await freelancer.getBalance())
    );
  });

  it("Should create a new project", async function () {
    const freelanceDAOWithFreelancer = freelanceDAO.connect(freelancer);

    // Freelancer creates a project
    const tx = await freelanceDAOWithFreelancer.createProject(
      "Test Project",
      "Description of test project",
      ethers.utils.parseEther("0.5")
    );

    await tx.wait();

    const project = await freelanceDAO.projects(0);
    console.log("Project retrieved from contract:", project); // Debugging

    // Destructure the project fields
    const [
      id,
      client,
      freelancerAddr,
      amount,
      name,
      description,
      deadline,
      isCompleted,
      isDisputed,
      isAccepted,
    ] = Object.values(project);

    // Validate project details
    expect(id.toNumber()).to.equal(0); // Ensure ID is set correctly
    expect(name).to.equal("Test Project");
    expect(description).to.equal("Description of test project");
    expect(freelancerAddr).to.equal(freelancer.address);
    expect(amount.toString()).to.equal(
      ethers.utils.parseEther("0.5").toString()
    );
    expect(client).to.equal(ethers.constants.AddressZero);
    expect(isAccepted).to.be.false;
  });

  it("Should allow a client to accept terms by sending the correct Ether amount", async function () {
    const freelanceDAOWithFreelancer = freelanceDAO.connect(freelancer);

    await freelanceDAOWithFreelancer.createProject(
      "Test Project",
      "Description of test project",
      ethers.utils.parseEther("0.5")
    );

    const freelanceDAOWithClient = freelanceDAO.connect(client);

    // Client accepts the project
    const tx = await freelanceDAOWithClient.acceptTerms(0, {
      value: ethers.utils.parseEther("0.5"),
    });

    await tx.wait();

    const project = await freelanceDAO.projects(0);

    // Validate project state
    expect(project.client).to.equal(client.address);
    expect(project.isAccepted).to.be.true;
  });

  it("Should allow a freelancer to mark a project as completed", async function () {
    const freelanceDAOWithFreelancer = freelanceDAO.connect(freelancer);

    // Freelancer creates a project
    await freelanceDAOWithFreelancer.createProject(
      "Test Project",
      "Description of test project",
      ethers.utils.parseEther("0.5")
    );

    const freelanceDAOWithClient = freelanceDAO.connect(client);

    // Client accepts the project
    await freelanceDAOWithClient.acceptTerms(0, {
      value: ethers.utils.parseEther("0.5"),
    });

    // Check the project's deadline
    const project = await freelanceDAO.projects(0);
    console.log("Project deadline:", project.deadline.toString());
    console.log(
      "Current block timestamp:",
      (await ethers.provider.getBlock("latest")).timestamp
    );

    // Simulate time passing (if necessary)
    await ethers.provider.send("evm_increaseTime", [3000]); // Fast-forward 3000 seconds
    await ethers.provider.send("evm_mine"); // Mine a new block

    // Freelancer marks the project as completed
    const tx = await freelanceDAOWithFreelancer.markAsCompleted(0);
    await tx.wait();

    const updatedProject = await freelanceDAO.projects(0);

    // Validate project state
    expect(updatedProject.isCompleted).to.be.true;
  });
});
