const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const filePath = path.join(__dirname, '..', 'candidates.json');
  const candidateData = fs.readFileSync(filePath);
  const candidates = JSON.parse(candidateData).candidates;

  if (candidates.length === 0) {
    throw new Error("No candidate names provided");
  }

  const Voting = await hre.ethers.getContractFactory("Voting");
  const Voting_ = await Voting.deploy(candidates, 200000); // Duration is hard-coded here, adjust as needed

  await Voting_.deployed();
  console.log(`Contract deployed to address: ${Voting_.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

