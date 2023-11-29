require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { GOERLI_API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.11",
  networks: {
    hardhat: {},
    goerli: {
      url: GOERLI_API_URL, // RPC URL for Goerli test network
      accounts: [`0x${PRIVATE_KEY}`], // Your wallet private key
      // gas and gasPrice are automatically handled by Hardhat, so you don't need to specify them
      // unless you want to override the defaults
    },
    // Remove the volta network configuration if you're not using it
    // You can keep other network configurations here as needed
  },
};
