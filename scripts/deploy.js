const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const Voting_ = await Voting.deploy(['Candidate1', 'Candidate2', 'Candidate3'], 200000);

  await Voting_.deployed();

  console.log(`Contract address: ${Voting_.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
