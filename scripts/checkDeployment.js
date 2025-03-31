require("dotenv").config(); // Ensure dotenv is loaded
const hre = require("hardhat");

async function main() {
  const provider = new hre.ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const contractAddress = process.env.VITE_CONTRACT_ADDRESS;

  const Voting = await hre.ethers.getContractFactory("Voting");
  console.log("Contract address:", contractAddress);
  const voting = Voting.attach(contractAddress);

  // Check if the contract is deployed by calling a function
  let totalVotes;
  try {
    totalVotes = await voting.getTotalVotes();
  } catch (error) {
    console.error("Could not retrieve total votes:", error);
    totalVotes = 0; // Default to 0 if there's an error
  }

  console.log("Contract is deployed. Total votes:", totalVotes.toString());
}

main().catch((error) => {
  console.error("Error checking deployment:", error);
  process.exitCode = 1;
});
