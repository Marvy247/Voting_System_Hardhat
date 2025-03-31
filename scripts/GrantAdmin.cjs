const hre = require("hardhat");
require("dotenv").config(); // Load environment variables

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const contractAddress = process.env.VITE_CONTRACT_ADDRESS; // Use process.env to access environment variables
  const voting = await hre.ethers.getContractAt("Voting", contractAddress);

  // Replace with your MetaMask address
  const yourMetaMaskAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const tx = await voting.addAdmin(yourMetaMaskAddress);
  await tx.wait();
  console.log(`Added admin: ${tx.hash}`);
}

main().catch(console.error);
