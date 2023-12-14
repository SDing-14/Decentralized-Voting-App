// Import necessary libraries and modules
const hre = require("hardhat"); // Hardhat runtime environment
const fs = require('fs');       // Node.js file system module for reading files
const path = require('path');   // Node.js path module for handling file paths

/**
 * Main asynchronous function to deploy the Voting contract.
 */
async function main() {
  // Define the path to the candidates.json file and read its contents
  const filePath = path.join(__dirname, '..', 'candidates.json');
  const candidateData = fs.readFileSync(filePath);
  
  // Parse the JSON data to get the array of candidate names
  const candidates = JSON.parse(candidateData).candidates;

  // Throw an error if no candidate names are provided
  if (candidates.length === 0) {
    throw new Error("No candidate names provided");
  }

  // Use Hardhat to get the contract factory for the 'Voting' contract
  const Voting = await hre.ethers.getContractFactory("Voting");

  // Deploy the Voting contract with the list of candidates and a fixed duration (200,000 seconds here)
  const Voting_ = await Voting.deploy(candidates, 200000);

  // Wait for the contract to be deployed
  await Voting_.deployed();

  // Log the address at which the contract has been deployed
  console.log(`Contract deployed to address: ${Voting_.address}`);
}

// Run the main function and catch any errors
main().catch((error) => {
  console.error(error); // Log the error
  process.exitCode = 1; // Exit the script with a non-zero exit code to indicate an error
});
