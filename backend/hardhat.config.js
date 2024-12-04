require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: {
        count: 10, // Ensure enough accounts for testing
        initialIndex: 0, // Start from the first account
        balance: "1000000000000000000000", // 1000 ETH
      },
    },
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
