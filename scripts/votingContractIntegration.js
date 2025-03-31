import { ethers } from "ethers";
import VotingContractABI from "../artifacts/contracts/Voting.sol/Voting.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

// Singleton contract instance
let contractInstance = null;
let provider = null;

// Initialize provider and contract
const initializeContract = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask not installed");
  }

  if (!provider) {
    provider = new ethers.BrowserProvider(window.ethereum);
  }

  if (!contractInstance) {
    const signer = await provider.getSigner();
    contractInstance = new ethers.Contract(
      contractAddress,
      VotingContractABI.abi,
      signer
    );
  }

  return contractInstance;
};

// Enhanced transaction handler
const handleTransaction = async (txPromise, successMessage) => {
  try {
    const tx = await txPromise;
    const receipt = await tx.wait();
    console.log(successMessage, receipt);
    return receipt;
  } catch (error) {
    console.error("Transaction failed:", error);

    let errorMessage = "Transaction failed";
    if (error.reason) {
      // Parse Solidity error messages
      errorMessage += `: ${error.reason.replace(/^execution reverted: /, "")}`;
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }

    throw new Error(errorMessage);
  }
};

// Contract functions with improved validation
export const startVoting = async (durationInMinutes) => {
  if (!Number.isInteger(durationInMinutes) || durationInMinutes <= 0) {
    throw new Error("Duration must be a positive integer");
  }

  const contract = await initializeContract();
  return handleTransaction(
    contract.startVoting(durationInMinutes),
    `Voting started for ${durationInMinutes} minutes`
  );
};

export const endVoting = async () => {
  const contract = await initializeContract();
  return handleTransaction(contract.endVoting(), "Voting ended successfully");
};

export const addCandidate = async (name) => {
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new Error("Candidate name must be a non-empty string");
  }

  const contract = await initializeContract();
  return handleTransaction(
    contract.addCandidate(name.trim()),
    `Candidate "${name}" added successfully`
  );
};

export const deleteCandidate = async (candidateId) => {
  if (!Number.isInteger(candidateId) || candidateId <= 0) {
    throw new Error("Candidate ID must be a positive integer");
  }

  const contract = await initializeContract();
  return handleTransaction(
    contract.deleteCandidate(candidateId),
    `Candidate ${candidateId} deleted successfully`
  );
};

export const vote = async (candidateId) => {
  if (!Number.isInteger(candidateId) || candidateId <= 0) {
    throw new Error("Candidate ID must be a positive integer");
  }

  const contract = await initializeContract();
  return handleTransaction(
    contract.vote(candidateId),
    `Vote cast for candidate ${candidateId} successfully`
  );
};

// Data fetching functions with improved error handling
export const getCandidate = async (candidateId) => {
  if (!Number.isInteger(candidateId) || candidateId <= 0) {
    throw new Error("Candidate ID must be a positive integer");
  }

  const contract = await initializeContract();
  try {
    const candidate = await contract.getCandidate(candidateId);
    return {
      id: candidate[0].toString(),
      name: candidate[1],
      voteCount: candidate[2].toString(),
    };
  } catch (error) {
    console.error(`Error fetching candidate ${candidateId}:`, error);
    throw new Error(`Candidate ${candidateId} not found`);
  }
};

export const getAllCandidates = async () => {
  const contract = await initializeContract();
  try {
    const count = await contract.getTotalCandidates();
    const candidates = [];

    // Use Promise.all for parallel fetching
    const candidatePromises = [];
    for (let i = 1; i <= count; i++) {
      candidatePromises.push(
        contract.getCandidate(i).catch((e) => {
          console.warn(`Candidate ${i} might be deleted`, e);
          return null;
        })
      );
    }

    const results = await Promise.all(candidatePromises);
    return results
      .filter((candidate) => candidate && candidate[0] != 0)
      .map((candidate) => ({
        id: candidate[0].toString(),
        name: candidate[1],
        voteCount: candidate[2].toString(),
      }));
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw new Error("Failed to fetch candidates");
  }
};

export const getTotalVotes = async () => {
  const contract = await initializeContract();
  try {
    const votes = await contract.getTotalVotes();
    return votes.toString();
  } catch (error) {
    console.error("Error fetching total votes:", error);
    throw new Error("Failed to fetch total votes");
  }
};

export const isVotingActive = async () => {
  const contract = await initializeContract();
  try {
    return await contract.votingActive();
  } catch (error) {
    console.error("Error checking voting status:", error);
    throw new Error("Failed to check voting status");
  }
};

export const getVotingEndTime = async () => {
  const contract = await initializeContract();
  try {
    const endTime = await contract.votingEndTime();
    return new Date(Number(endTime) * 1000).toISOString();
  } catch (error) {
    console.error("Error fetching voting end time:", error);
    throw new Error("Failed to fetch voting end time");
  }
};

export const getCurrentAccount = async () => {
  const provider = await initializeContract();
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  return address;
};

export const registerVoter = async (address) => {
  if (!ethers.isAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const contract = await initializeContract();
  return handleTransaction(
    contract.registerVoter(address),
    `Voter registered: ${address}`
  );
};

// Wallet functions
export const connectWallet = async () => {
  try {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask not installed");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    if (!accounts?.length) {
      throw new Error("No accounts found");
    }

    return accounts[0];
  } catch (error) {
    console.error("Wallet connection failed:", error);
    throw error;
  }
};

export const hasVoted = async (address) => {
  if (!ethers.isAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const contract = await initializeContract();
  try {
    const candidateId = await contract.getVoterVote(address);
    return candidateId > 0;
  } catch (error) {
    console.error("Error checking vote status:", error);
    throw new Error("Failed to check voting status");
  }
};

export const listenToCandidateAdded = (callback) => {
  if (!contractInstance) {
    throw new Error("Contract not initialized");
  }

  const listener = (name, event) => {
    callback({
      name,
      txHash: event.transactionHash,
    });
  };

  contractInstance.on("CandidateAdded", listener);
  return () => contractInstance.off("CandidateAdded", listener);
};

export const listenToCandidateRemoved = (callback) => {
  if (!contractInstance) {
    throw new Error("Contract not initialized");
  }

  const listener = (candidateId, event) => {
    callback({
      candidateId: candidateId.toString(),
      txHash: event.transactionHash,
    });
  };

  contractInstance.on("CandidateRemoved", listener);
  return () => contractInstance.off("CandidateRemoved", listener);
};

export const listenToVotingEnded = (callback) => {
  if (!contractInstance) {
    throw new Error("Contract not initialized");
  }

  const listener = (event) => {
    callback({
      txHash: event.transactionHash,
    });
  };

  contractInstance.on("VotingEnded", listener);
  return () => contractInstance.off("VotingEnded", listener);
};

// Event listeners
export const listenToVoteCast = (callback) => {
  if (!contractInstance) {
    throw new Error("Contract not initialized");
  }

  const listener = (voter, candidateId, event) => {
    callback({
      voter,
      candidateId: candidateId.toString(),
      txHash: event.transactionHash,
    });
  };

  contractInstance.on("VoteCast", listener);
  return () => contractInstance.off("VoteCast", listener);
};

export const listenToVotingStarted = (callback) => {
  if (!contractInstance) {
    throw new Error("Contract not initialized");
  }

  const listener = (duration, endTime, event) => {
    callback({
      duration: duration.toString(),
      endTime: new Date(Number(endTime) * 1000),
      txHash: event.transactionHash,
    });
  };

  contractInstance.on("VotingStarted", listener);
  return () => contractInstance.off("VotingStarted", listener);
};
