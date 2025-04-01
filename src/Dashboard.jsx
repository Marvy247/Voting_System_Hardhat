import React, { useEffect, useState } from "react";
import {
  FaVoteYea,
  FaChartLine,
  FaUserTie,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUserPlus,
  FaUserEdit,
  FaTrash,
  FaPlus,
  FaWallet,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllCandidates,
  isVotingActive,
  getTotalVotes,
  isAdmin,
  connectWallet,
  vote,
  addCandidate,
  deleteCandidate,
  startVoting,
  endVoting,
} from "./votingContractIntegration";
import AddCandidateModal from "./AddCandidateModal";
import ManageCandidateModal from "./ManageCandidateModal";
import AddVoteModal from "./AddVoteModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [votingActive, setVotingActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [account, setAccount] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Connect wallet on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            checkAdminStatus(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    checkWalletConnection();
  }, []);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allCandidates, votes, votingStatus] = await Promise.all([
          getAllCandidates(),
          getTotalVotes(),
          isVotingActive(),
        ]);
        setCandidates(allCandidates);
        setTotalVotes(votes);
        setVotingActive(votingStatus);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (account) {
      fetchData();
    }
  }, [account, showAddModal, showManageModal, showVoteModal]);

  const ADMIN_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const checkAdminStatus = async (address) => {
    if (address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
      setIsAdminUser(true);
      return;
    }
    try {
      const adminStatus = await isAdmin(address);
      setIsAdminUser(adminStatus);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const account = await connectWallet();
      setAccount(account);
      await checkAdminStatus(account);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const handleVote = async (candidateId) => {
    try {
      await vote(candidateId);
      const [allCandidates, votes] = await Promise.all([
        getAllCandidates(),
        getTotalVotes(),
      ]);
      setCandidates(allCandidates);
      setTotalVotes(votes);
    } catch (error) {
      console.error("Voting failed:", error);
    }
  };

  const handleStartVoting = async (duration) => {
    try {
      await startVoting(duration);
      setVotingActive(true);
    } catch (error) {
      console.error("Failed to start voting:", error);
    }
  };

  const handleEndVoting = async () => {
    try {
      await endVoting();
      setVotingActive(false);
    } catch (error) {
      console.error("Failed to end voting:", error);
    }
  };

  const handleManageCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowManageModal(true);
  };

  const handleAddVote = (candidate) => {
    setSelectedCandidate(candidate);
    setShowVoteModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl my-16 mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <FaVoteYea className="text-purple-400" /> Election Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              {account
                ? `Connected as: ${account.substring(
                    0,
                    6
                  )}...${account.substring(38)}`
                : "Connect your wallet to participate"}
            </p>
            {/* Navigation Buttons for Voting and Results Pages */}
            {/* Navigation Buttons for Voting and Results Pages */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              <button
                onClick={() => navigate("/voting")}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <FaVoteYea /> Go to Voting Page
              </button>
              <button
                onClick={() => navigate("/results")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <FaChartLine /> View Voting Results
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            {!account ? (
              <button
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <FaWallet /> Connect Wallet
              </button>
            ) : loading ? (
              <>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 w-36">
                  <div className="animate-pulse space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-700 rounded-full"></div>
                      <div className="h-4 w-16 bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-4 w-4 bg-gray-700 rounded-full"></div>
                      <div className="h-4 w-24 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 w-36">
                  <div className="animate-pulse space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-700 rounded-full"></div>
                      <div className="h-4 w-16 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-8 w-20 bg-gray-700 rounded mt-1"></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaClock /> Status:
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {votingActive ? (
                      <>
                        <FaCheckCircle className="text-green-400" />
                        <span className="font-medium">Voting Active</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-red-400" />
                        <span className="font-medium">Voting Closed</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaChartLine /> Total Votes:
                  </div>
                  <div className="text-2xl font-bold text-purple-300 mt-1">
                    {totalVotes.toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Admin Controls */}
        {isAdminUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 flex flex-wrap gap-4"
          >
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
            >
              <FaUserPlus /> Add Candidate
            </button>

            <button
              onClick={() => setShowVoteModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
            >
              <FaPlus /> Add Votes
            </button>

            {votingActive ? (
              <button
                onClick={handleEndVoting}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
              >
                End Voting
              </button>
            ) : (
              <button
                onClick={() => handleStartVoting(60)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
              >
                Start Voting
              </button>
            )}
          </motion.div>
        )}

        {/* Candidates Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FaUserTie className="text-blue-400" /> Candidates
            </h2>
            {isAdminUser && (
              <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                Admin Mode
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 animate-pulse"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="h-6 w-32 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 w-20 bg-gray-700 rounded"></div>
                      </div>
                      <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="space-y-3 mt-6">
                      <div className="flex justify-between">
                        <div className="h-4 w-16 bg-gray-700 rounded"></div>
                        <div className="h-4 w-10 bg-gray-700 rounded"></div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 bg-gray-600 rounded-full"
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                      <div className="h-4 w-20 bg-gray-700 rounded ml-auto"></div>
                    </div>
                    <div className="h-10 w-full bg-gray-700 rounded-lg mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : candidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors relative"
                >
                  {isAdminUser && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => handleManageCandidate(candidate)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                        title="Manage Candidate"
                      >
                        <FaUserEdit className="text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleAddVote(candidate)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                        title="Add Votes"
                      >
                        <FaPlus className="text-green-400" />
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{candidate.name}</h3>
                      <p className="text-gray-400 mt-1">ID: {candidate.id}</p>
                    </div>
                    <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Votes:</span>
                      <span className="font-bold text-white">
                        {candidate.voteCount.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (candidate.voteCount / Math.max(1, totalVotes)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>

                    <div className="mt-2 text-right text-sm text-gray-400">
                      {totalVotes > 0
                        ? `${((candidate.voteCount / totalVotes) * 100).toFixed(
                            1
                          )}% of total`
                        : "No votes yet"}
                    </div>
                  </div>

                  {account && !isAdminUser && votingActive && (
                    <button
                      onClick={() => handleVote(candidate.id)}
                      className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-colors"
                    >
                      Vote for this candidate
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
              <p className="text-gray-400">No candidates available</p>
              {isAdminUser && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 flex items-center gap-2 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                >
                  <FaUserPlus /> Add First Candidate
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Stats Section */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6">Voting Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="animate-pulse space-y-3">
                    <div className="h-5 w-24 bg-gray-700 rounded"></div>
                    <div className="h-8 w-32 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : candidates.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6">Voting Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-2">Leading Candidate</h3>
                <p className="text-xl font-bold">
                  {
                    candidates.reduce((prev, current) =>
                      prev.voteCount > current.voteCount ? prev : current
                    ).name
                  }
                </p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-2">Average Votes</h3>
                <p className="text-xl font-bold">
                  {Math.round(totalVotes / candidates.length).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-2">Candidates</h3>
                <p className="text-xl font-bold">{candidates.length}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddCandidateModal
            onClose={() => setShowAddModal(false)}
            account={account}
          />
        )}

        {showManageModal && selectedCandidate && (
          <ManageCandidateModal
            candidate={selectedCandidate}
            onClose={() => setShowManageModal(false)}
            account={account}
          />
        )}

        {showVoteModal && (
          <AddVoteModal
            candidates={candidates}
            selectedCandidate={selectedCandidate}
            onClose={() => setShowVoteModal(false)}
            account={account}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
