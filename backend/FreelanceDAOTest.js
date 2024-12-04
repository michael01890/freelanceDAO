const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FreelanceDAO", function () {
  let freelanceDAO, owner, client, freelancer;

  beforeEach(async function () {
    // Deploy contract before each test
    [owner, client, freelancer] = await ethers.getSigners();
    const FreelanceDAO = await ethers.getContractFactory("FreelanceDAO");
    freelanceDAO = await FreelanceDAO.deploy();
    await freelanceDAO.deployed();
  });

  it("should allow a freelancer to create a project", async function () {
    await freelanceDAO
      .connect(freelancer)
      .createProject("Website Development", "Build a website", ethers.utils.parseEther("1"));

    const project = await freelanceDAO.projects(0);

    expect(project.freelancer).to.equal(freelancer.address);
    expect(project.name).to.equal("Website Development");
    expect(project.amount).to.equal(ethers.utils.parseEther("1"));
  });

  it("should allow a client to accept terms and fund a project", async function () {
    await freelanceDAO
      .connect(freelancer)
      .createProject("Website Development", "Build a website", ethers.utils.parseEther("1"));

    await freelanceDAO.connect(client).acceptTerms(0, {
      value: ethers.utils.parseEther("1"),
    });

    const project = await freelanceDAO.projects(0);
    expect(project.client).to.equal(client.address);
    expect(project.isAccepted).to.be.true;
  });

  it("should allow freelancer to mark the project as completed", async function () {
    await freelanceDAO
      .connect(freelancer)
      .createProject("Website Development", "Build a website", ethers.utils.parseEther("1"));

    await freelanceDAO.connect(client).acceptTerms(0, {
      value: ethers.utils.parseEther("1"),
    });

    await freelanceDAO.connect(freelancer).markAsCompleted(0);

    const project = await freelanceDAO.projects(0);
    expect(project.isCompleted).to.be.true;
  });

  it("should allow client to confirm completion and transfer funds", async function () {
    await freelanceDAO
      .connect(freelancer)
      .createProject("Website Development", "Build a website", ethers.utils.parseEther("1"));

    await freelanceDAO.connect(client).acceptTerms(0, {
      value: ethers.utils.parseEther("1"),
    });

    await freelanceDAO.connect(freelancer).markAsCompleted(0);

    const initialFreelancerBalance = await ethers.provider.getBalance(freelancer.address);

    await freelanceDAO.connect(client).confirmCompletion(0);

    const finalFreelancerBalance = await ethers.provider.getBalance(freelancer.address);
    expect(finalFreelancerBalance.sub(initialFreelancerBalance)).to.equal(
      ethers.utils.parseEther("1")
    );
  });

  it("should allow disputes to be raised and resolved", async function () {
    await freelanceDAO
      .connect(freelancer)
      .createProject("Website Development", "Build a website", ethers.utils.parseEther("1"));

    await freelanceDAO.connect(client).acceptTerms(0, {
      value: ethers.utils.parseEther("1"),
    });

    await freelanceDAO.connect(client).raiseDispute(0);

    const project = await freelanceDAO.projects(0);
    expect(project.isDisputed).to.be.true;

    await freelanceDAO.connect(client).voteOnDispute(0, false); // Client votes against freelancer
    await freelanceDAO.connect(freelancer).voteOnDispute(0, true); // Freelancer votes for themselves
    await freelanceDAO.connect(owner).voteOnDispute(0, true); // Arbitrator votes for freelancer

    const updatedProject = await freelanceDAO.projects(0);
    expect(updatedProject.isDisputed).to.be.false;
  });

  it("should allow profile creation and retrieval", async function () {
    await freelanceDAO.connect(freelancer).createOrUpdateProfile("John Doe", "Web Developer", "avatar.png");

    const profile = await freelanceDAO.getProfile(freelancer.address);
    expect(profile.name).to.equal("John Doe");
    expect(profile.bio).to.equal("Web Developer");
    expect(profile.avatar).to.equal("avatar.png");
  });
});
