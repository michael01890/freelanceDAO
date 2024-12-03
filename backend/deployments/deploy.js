const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Deploy FreelanceDAO
  const FreelanceDAO = await hre.ethers.getContractFactory("FreelanceDAO");
  const freelanceDAO = await FreelanceDAO.deploy();

  await freelanceDAO.deployed();

  console.log("FreelanceDAO deployed to:", freelanceDAO.address);

  // Path to the ABI in artifacts
  const abiPath = path.join(
    __dirname,
    "../artifacts/contracts/FreelanceDAO.sol/FreelanceDAO.json"
  );
  const abi = JSON.parse(fs.readFileSync(abiPath, "utf8")).abi;

  // Path to the frontend's ABI file
  const frontendAbiPath = path.join(
    __dirname,
    "../../frontend/src/contractABI_FreelanceDAO.json"
  );

  // Write the ABI to the frontend
  fs.writeFileSync(frontendAbiPath, JSON.stringify(abi, null, 2));

  // Write the contract address to the frontend
  const frontendAddressPath = path.join(
    __dirname,
    "../../frontend/src/contractAddresses.js"
  );
  const contractAddressContent = `export const freelanceDAOAddress = "${freelanceDAO.address}";\n`;
  fs.writeFileSync(frontendAddressPath, contractAddressContent);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
