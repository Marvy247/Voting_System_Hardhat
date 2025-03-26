// Use this import instead
import { ethers } from "ethers";

import VotingContractABI from "../../artifacts/contracts/Voting.sol/Voting.json";

// Configurable contract address
let contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

// Initialize provider and signer
const getProvider = () => {
  if (typeof window.ethereum === "undefined") {
    console.error(
      "Ethereum provider not found. Please install MetaMask and ensure it is enabled."
    );
    throw new Error(
      "Ethereum provider not found. Please install MetaMask and ensure it is enabled."
    );
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("Ethereum provider initialized successfully.");
    return provider;
  } catch (error) {
    throw new Error("Failed to initialize Ethereum provider");
  }
};
// Function to initialize the contract
const getVotingContract = () => {
  const provider = getProvider();
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, VotingContractABI.abi, signer);
};

// Configuration
export const setContractAddress = (address) => {
  contractAddress = address;
};

// Contract Functions

// Voting lifecycle
export const startVoting = async (durationInMinutes) => {
  const votingContract = getVotingContract();
  try {
    const tx = await votingContract.startVoting(durationInMinutes);
    const receipt = await tx.wait();
    console.log(
      `Voting started for ${durationInMinutes} minutes. Tx: ${receipt.transactionHash}`
    );
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      duration: durationInMinutes,
    };
  } catch (error) {
    console.error("Error starting voting:", error);
    throw enhanceError(error);
  }
};

export const endVoting = async () => {
  const votingContract = getVotingContract();
  try {
    const tx = await votingContract.endVoting();
    const receipt = await tx.wait();
    console.log(`Voting ended. Tx: ${receipt.transactionHash}`);
    return {
      success: true,
      transactionHash: receipt.transactionHash,
    };
  } catch (error) {
    console.error("Error ending voting:", error);
    throw enhanceError(error);
  }
};

// Candidate management
export const addCandidate = async (name) => {
  const votingContract = getVotingContract();
  try {
    const tx = await votingContract.addCandidate(name);
    const receipt = await tx.wait();
    console.log(`Candidate "${name}" added. Tx: ${receipt.transactionHash}`);

    // Get the candidate ID from the event
    const event = receipt.events?.find((e) => e.event === "CandidateAdded");
    const candidateId = event?.args?.candidateId.toNumber();

    return {
      success: true,
      transactionHash: receipt.transactionHash,
      candidateId: candidateId || null,
    };
  } catch (error) {
    console.error("Error adding candidate:", error);
    throw enhanceError(error);
  }
};

export const deleteCandidate = async (candidateId) => {
  const votingContract = getVotingContract();
  try {
    const tx = await votingContract.deleteCandidate(candidateId);
    const receipt = await tx.wait();
    console.log(
      `Candidate ${candidateId} deleted. Tx: ${receipt.transactionHash}`
    );
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      candidateId,
    };
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw enhanceError(error);
  }
};

export const isVoterRegistered = async (voterAddress) => {
  const votingContract = getVotingContract();
  try {
    const registered = await votingContract.isVoterRegistered(voterAddress);
    return registered;
  } catch (error) {
    console.error("Error checking voter registration:", error);
    throw enhanceError(error);
  }
};

// Voter management
export const registerVoter = async (voterAddress) => {
  const votingContract = getVotingContract();
  try {
    const tx = await votingContract.registerVoter(voterAddress);
    const receipt = await tx.wait();
    console.log(
      `Voter ${voterAddress} registered. Tx: ${receipt.transactionHash}`
    );
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      voterAddress,
    };
  } catch (error) {
    console.error("Error registering voter:", error);
    throw enhanceError(error);
  }
};

// Voting
export const vote = async (candidateId) => {
  const votingContract = getVotingContract();
  try {
    // Estimate gas first
    const estimatedGas = await votingContract.estimateGas.vote(candidateId);

    // Send transaction with buffer
    const tx = await votingContract.vote(candidateId, {
      gasLimit: estimatedGas.mul(120).div(100), // 20% buffer
    });

    const receipt = await tx.wait();
    console.log(
      `Vote cast for candidate ${candidateId}. Tx: ${receipt.transactionHash}`
    );
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      candidateId,
    };
  } catch (error) {
    console.error("Error casting vote:", error);
    throw enhanceError(error);
  }
};

// Getters
export const getCandidate = async (candidateId) => {
  const votingContract = getVotingContract();
  try {
    const candidate = await votingContract.getCandidate(candidateId);
    return {
      id: candidateId,
      name: candidate.name,
      voteCount: candidate.voteCount.toNumber(),
    };
  } catch (error) {
    console.error("Error fetching candidate:", error);
    throw enhanceError(error);
  }
};

export const getAllCandidates = async () => {
  const votingContract = getVotingContract();
  try {
    const totalCandidates = await votingContract.getTotalCandidates();
    const candidates = [];

    for (let i = 0; i < totalCandidates; i++) {
      const candidate = await votingContract.getCandidate(i);
      candidates.push({
        id: i,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber(),
      });
    }

    return candidates;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw enhanceError(error);
  }
};

export const getTotalVotes = async () => {
  const votingContract = getVotingContract();
  try {
    const totalVotes = await votingContract.getTotalVotes();
    return totalVotes.toNumber();
  } catch (error) {
    console.error("Error fetching total votes:", error);
    throw enhanceError(error);
  }
};

export const getTotalCandidates = async () => {
  const votingContract = getVotingContract();
  try {
    const totalCandidates = await votingContract.getTotalCandidates();
    return totalCandidates.toNumber();
  } catch (error) {
    console.error("Error fetching total candidates:", error);
    throw enhanceError(error);
  }
};

export const getVotingStatus = async () => {
  const votingContract = getVotingContract();
  try {
    const isActive = await votingContract.isVotingActive();
    const endTime = await votingContract.votingEndTime();
    return {
      isActive,
      endTime: new Date(endTime.toNumber() * 1000),
    };
  } catch (error) {
    console.error("Error fetching voting status:", error);
    throw enhanceError(error);
  }
};

export const isVotingActive = async () => {
  const votingContract = getVotingContract();
  try {
    return await votingContract.isVotingActive();
  } catch (error) {
    console.error("Error checking voting status:", error);
    throw enhanceError(error);
  }
};

export const getVotingEndTime = async () => {
  const votingContract = getVotingContract();
  try {
    const endTime = await votingContract.votingEndTime();
    return new Date(endTime.toNumber() * 1000);
  } catch (error) {
    console.error("Error fetching voting end time:", error);
    throw enhanceError(error);
  }
};

// Event listeners
export const listenToVoteCast = (callback) => {
  const votingContract = getVotingContract();
  votingContract.on("VoteCast", (voter, candidateId, event) => {
    callback({
      voter,
      candidateId: candidateId.toNumber(),
      transactionHash: event.transactionHash,
    });
  });

  return () => votingContract.off("VoteCast");
};

export const listenToVotingStarted = (callback) => {
  const votingContract = getVotingContract();
  votingContract.on("VotingStarted", (duration, endTime, event) => {
    callback({
      duration: duration.toNumber(),
      endTime: new Date(endTime.toNumber() * 1000),
      transactionHash: event.transactionHash,
    });
  });

  return () => votingContract.off("VotingStarted");
};

// Helper function to enhance error messages
const enhanceError = (error) => {
  const enhancedError = new Error(error.message);
  enhancedError.reason =
    error.reason || error.data?.message || "Unknown reason";
  enhancedError.code = error.code;
  enhancedError.transactionHash = error.transactionHash;
  return enhancedError;
};

// Connection helpers
export const connectWallet = async () => {
  try {
    // First check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      throw new Error(
        "MetaMask is not installed. Please install it to continue."
      );
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Request account access
    const accounts = await window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .catch((error) => {
        if (error.code === 4001) {
          // User rejected request
          throw new Error("Please connect to MetaMask to continue.");
        }
        throw error;
      });

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please ensure MetaMask is unlocked.");
    }

    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return address;
  } catch (error) {
    console.error("Wallet connection error:", error);
    throw enhanceError(error);
  }
};

export const getCurrentAccount = async () => {
  try {
    if (typeof window.ethereum === "undefined") {
      return null;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting current account:", error);
    return null; // Return null instead of throwing for silent failure
  }
};
