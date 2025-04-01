import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaVoteYea, FaCheckCircle, FaUserTie, FaSpinner } from "react-icons/fa";
import { getAllCandidates, vote, hasVoted } from "./votingContractIntegration";

const VotingPage = ({ userAddress }) => {
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allCandidates, hasUserVoted] = await Promise.all([
          getAllCandidates(),
          hasVoted(userAddress),
        ]);
        setCandidates(allCandidates);
        setVoted(hasUserVoted);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userAddress) {
      fetchData();
    }
  }, [userAddress]);

  const handleVote = async (candidateId) => {
    try {
      setIsProcessing(true);
      setSelectedCandidate(candidateId);
      await vote(candidateId);
      setVoted(true);
    } catch (error) {
      console.error("Voting failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-200 flex items-center justify-center gap-3">
            <FaVoteYea className="text-purple-100" /> Election Voting
          </h1>
          <p className="text-gray-300 mt-2">
            {userAddress
              ? `Connected as: ${userAddress.substring(
                  0,
                  6
                )}...${userAddress.substring(38)}`
              : "Please connect your wallet"}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 animate-pulse"
              >
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : voted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto"
          >
            <div className="text-green-500 text-6xl mb-4 flex justify-center">
              <FaCheckCircle />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Thank You!
            </h2>
            <p className="text-gray-600 mb-6">
              Your vote has been recorded successfully.
            </p>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-500">Transaction completed</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FaUserTie className="text-blue-500" /> Available Candidates
              </h2>
              <p className="text-gray-600 mt-1">
                Select your preferred candidate
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${
                    selectedCandidate === candidate.id
                      ? "border-purple-500"
                      : "border-transparent"
                  } transition-all`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {candidate.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          ID: {candidate.id}
                        </p>
                      </div>
                      <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                        Candidate
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500">Votes:</span>
                        <span className="font-bold text-gray-800">
                          {candidate.voteCount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleVote(candidate.id)}
                      disabled={isProcessing}
                      className={`w-full mt-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                        isProcessing && selectedCandidate === candidate.id
                          ? "bg-purple-400 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700"
                      } text-white transition-colors`}
                    >
                      {isProcessing && selectedCandidate === candidate.id ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaVoteYea />
                          Vote
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingPage;
