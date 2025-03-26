const fs = require("fs");
const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  console.log("Voting contract instance:", voting);

  // The deployed method is not needed; the contract is deployed directly.

  console.log("Voting contract deployment initiated...");
  console.log("Voting contract deployed to:", voting.target);
}

// Save the deployed contract address and ABI
const contractInfo = {
  address: voting.target,
  abi: Voting.interface.format("json"),
};

fs.writeFileSync(
  "deployed_contract_info.json",
  JSON.stringify(contractInfo, null, 2)
);

main().catch((error) => {
  console.error("Deployment failed with error:", error);
  process.exitCode = 1;
});
