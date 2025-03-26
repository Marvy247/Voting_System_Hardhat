import { ethers } from "ethers";
import VotingContractABI from "../artifacts/contracts/Voting.sol/Voting.json" assert { type: "json" };

const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F"; // Replace with your deployed contract address

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const votingContract = new ethers.Contract(
  contractAddress,
  VotingContractABI.abi,
  signer
);

const testConnection = async () => {
  try {
    const totalCandidates = await votingContract.getTotalCandidates();
    console.log("Total Candidates:", totalCandidates.toString());
  } catch (error) {
    console.error("Error connecting to the contract:", error);
  }
};

testConnection();
