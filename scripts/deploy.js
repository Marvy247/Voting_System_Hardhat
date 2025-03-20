const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Retrieve the Voting contract artifact
  const Voting = await hre.ethers.getContractFactory("Voting");

  // Deploy the contract
  console.log("Deploying Voting contract...");
  const voting = await Voting.deploy().catch((error) => {
    console.error("Deployment failed:", error.message);
    process.exit(1);
  });

  console.log("Voting contract deployed to:", voting.address);

  // Save the contract address and ABI to a JSON file
  const contractDetails = {
    address: voting.address,
    abi: JSON.parse(
      fs.readFileSync("artifacts/contracts/Voting.sol/Voting.json", "utf8")
    ).abi,
  };

  fs.writeFileSync(
    "deployedContract.json",
    JSON.stringify(contractDetails, null, 2)
  );
  console.log("Contract details saved to deployedContract.json");
}

// Execute the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
