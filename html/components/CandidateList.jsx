import React, { useEffect, useState } from "react";
import {
  FaVoteYea,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

// Mock data for testing
const MOCK_CANDIDATES = [
  { id: "1", name: "Alice Johnson", voteCount: "42" },
  { id: "2", name: "Bob Smith", voteCount: "35" },
  { id: "3", name: "Charlie Brown", voteCount: "28" },
];

const MOCK_VOTING_END_TIME = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

const CandidateList = ({ walletAddress, contractAddress }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votingInProgress, setVotingInProgress] = useState(false);
  const [votingEndTime, setVotingEndTime] = useState(null);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  // Initialize provider and contract
  useEffect(() => {
    const init = async () => {
      if (useMockData) {
        // Use mock data
        setCandidates(MOCK_CANDIDATES);
        setVotingEndTime(MOCK_VOTING_END_TIME.toLocaleString());
        setLoading(false);
        return;
      }

      if (typeof window.ethereum !== "undefined") {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // Initialize provider and signer
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          // Initialize contract
          const contract = new ethers.Contract(
            contractAddress,
            VotingContract.abi,
            signer
          );

          // Fetch candidates and voting end time
          await fetchCandidates(contract);
          await fetchVotingEndTime(contract);
        } catch (error) {
          console.error("Error initializing contract:", error);
          setError(
            "Failed to initialize contract. Would you like to use mock data instead?"
          );
          setLoading(false);
        }
      } else {
        setError(
          "Please install MetaMask to use this application. Would you like to use mock data instead?"
        );
        setLoading(false);
      }
    };

    init();
  }, [contractAddress, useMockData]);

  // Fetch candidates from the smart contract
  const fetchCandidates = async (contract) => {
    try {
      const totalCandidates = await contract.getTotalCandidates();
      console.log("Total candidates:", totalCandidates.toString());

      const candidatesArray = [];
      for (let i = 1; i <= totalCandidates; i++) {
        const candidate = await contract.getCandidate(i);
        candidatesArray.push({
          id: candidate[0].toString(),
          name: candidate[1],
          voteCount: candidate[2].toString(),
        });
      }

      setCandidates(candidatesArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError(
        "Failed to fetch candidates. Would you like to use mock data instead?"
      );
      setLoading(false);
    }
  };

  // Fetch voting end time
  const fetchVotingEndTime = async (contract) => {
    try {
      const endTime = await contract.votingEndTime();
      setVotingEndTime(new Date(endTime * 1000).toLocaleString());
    } catch (error) {
      console.error("Error fetching voting end time:", error);
      setError("Failed to fetch voting end time.");
    }
  };

  // Handle voting
  const handleVote = async (candidateId) => {
    if (!walletAddress && !useMockData) {
      alert("Please connect your wallet to vote.");
      return;
    }
    if (!candidateId) {
      alert("Please select a candidate to vote.");
      return;
    }

    try {
      setVotingInProgress(true);

      if (useMockData) {
        // Simulate voting delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update mock data
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === candidateId
              ? { ...c, voteCount: String(parseInt(c.voteCount) + 1) }
              : c
          )
        );
        setSelectedCandidate(candidateId);
        alert("Mock vote cast successfully!");
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          VotingContract.abi,
          signer
        );

        const tx = await contract.vote(candidateId);
        await tx.wait();

        alert("Vote cast successfully!");
        await fetchCandidates(contract); // Refresh the candidate list
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to cast vote. Please try again.");
    } finally {
      setVotingInProgress(false);
    }
  };

  const enableMockData = () => {
    setUseMockData(true);
    setError(null);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500">
        <FaSpinner className="animate-spin h-12 w-12 text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500">
        <div className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20 max-w-md">
          <FaExclamationCircle className="mx-auto h-12 w-12 text-purple-200 mb-4" />
          <p className="text-white text-xl mb-6">{error}</p>
          <button
            onClick={enableMockData}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Use Mock Data for Testing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-300 via-purple-400 to-purple-900 py-12 px-4 w-full sm:px-6 lg:px-8 mx-auto">
      <div className="max-w-3xl mx-auto">
        {useMockData && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-8 border border-white/20 flex items-center justify-center gap-2 shadow-lg">
            <FaInfoCircle className="text-purple-300" />
            <p className="text-purple-100 font-medium">
              Using Mock Data for Demonstration
            </p>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-white">
              Candidate List
            </span>
          </h1>
          {votingEndTime && (
            <p className="text-purple-200 text-lg">
              Voting ends on:{" "}
              <span className="font-semibold text-white">{votingEndTime}</span>
            </p>
          )}
        </div>

        <div className="space-y-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-purple-400/50 relative overflow-hidden"
            >
              {/* Subtle gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-purple-600/10 blur-3xl opacity-50"></div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {candidate.name}
                  </h2>

                  {/* Vote Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-purple-900/30 rounded-full h-2.5 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            parseInt(candidate.voteCount) * 2
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-white font-medium">
                      {candidate.voteCount} votes
                    </span>
                  </div>
                </div>

                {/* Vote Button */}
                <button
                  onClick={() => handleVote(candidate.id)}
                  disabled={
                    votingInProgress || selectedCandidate === candidate.id
                  }
                  className={`bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl ${
                    selectedCandidate === candidate.id
                      ? "ring-2 ring-purple-300 ring-offset-2 ring-offset-purple-900/50 cursor-not-allowed"
                      : ""
                  } ${votingInProgress ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {selectedCandidate === candidate.id ? (
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="h-5 w-5" />
                      <span>Voted</span>
                    </div>
                  ) : votingInProgress ? (
                    <div className="flex items-center gap-2">
                      <FaSpinner className="animate-spin h-5 w-5" />
                      <span>Voting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaVoteYea className="h-5 w-5" />
                      <span>Vote Now</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
