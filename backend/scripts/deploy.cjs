// scripts/deploy.cjs

const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const FreelanceDAO = await hre.ethers.getContractFactory("FreelanceDAO");

  // Deploy the contract and wait for it to be mined
  const freelanceDAO = await FreelanceDAO.deploy();

  // Log the deployed contract address
  console.log("FreelanceDAO deployed to:", freelanceDAO.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
