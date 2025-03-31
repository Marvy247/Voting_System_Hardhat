const fs = require("fs");
const hre = require("hardhat");
const path = require("path");
require("dotenv").config();

async function main() {
  // Connect to the Anvil network
  const provider = new hre.ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const accounts = await provider.listAccounts();
  const signer = provider.getSigner();

  // Deploy contract using Anvil network
  const Voting = await hre.ethers.getContractFactory("Voting", signer);
  const voting = await Voting.deploy();
  await voting.waitForDeployment();

  const contractAddress = voting.target;
  console.log("Voting contract deployed to:", contractAddress);

  // Save the deployed contract address and ABI
  const contractInfo = {
    address: contractAddress,
    abi: Voting.interface.format("json"),
  };

  fs.writeFileSync(
    "deployed_contract_info.json",
    JSON.stringify(contractInfo, null, 2)
  );

  // Save contract address to .env file
  const envPath = path.resolve(__dirname, "../.env");
  fs.writeFileSync(envPath, `VITE_CONTRACT_ADDRESS=${contractAddress}\n`, {
    flag: "w",
  });
  console.log("Contract address saved to .env file");
}

main().catch((error) => {
  console.error("Deployment failed with error:", error);
  process.exitCode = 1;
});
