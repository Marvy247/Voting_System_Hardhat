import React, { useEffect, useState } from "react";
import {
  FaVoteYea,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaClock,
  FaUserPlus,
  FaUserMinus,
  FaPlusCircle,
  FaTrash,
  FaLock,
  FaLockOpen,
  FaUserShield,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  connectWallet,
  getCurrentAccount,
  startVoting,
  endVoting,
  addCandidate,
  deleteCandidate,
  registerVoter,
  vote,
  getCandidate,
  getAllCandidates,
  getTotalVotes,
  getTotalCandidates,
  isVotingActive,
  getVotingEndTime,
  listenToVoteCast,
  listenToVotingStarted,
  setContractAddress,
} from "./VotingContract";

const CandidateList = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [votingActive, setVotingActive] = useState(false);
  const [votingEndTime, setVotingEndTime] = useState(null);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [votingDuration, setVotingDuration] = useState(60); // Default 60 minutes
  const [voterAddress, setVoterAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Check if current user is admin (replace with your actual admin check)
  const checkAdminStatus = async (address) => {
    // In a real app, you might check against a list of admin addresses
    // or call a contract function that checks admin status
    return address === "0xYourAdminAddressHere"; // Replace with actual admin address
  };

  // Initialize the app
  const init = async () => {
    try {
      setLoading(true);
      const address = await getCurrentAccount();
      if (address) {
        setAccount(address);
        setIsConnected(true);
        const adminStatus = await checkAdminStatus(address);
        setIsAdmin(adminStatus);
      }

      // Load contract data
      const active = await isVotingActive();
      setVotingActive(active);

      if (active) {
        const endTime = await getVotingEndTime();
        setVotingEndTime(endTime);
      }

      const allCandidates = await getAllCandidates();
      setCandidates(allCandidates);

      const votes = await getTotalVotes();
      setTotalVotes(votes);

      setLoading(false);
    } catch (err) {
      console.error("Initialization error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Connect wallet handler
  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setAccount(address);
      setIsConnected(true);
      const adminStatus = await checkAdminStatus(address);
      setIsAdmin(adminStatus);
      toast.success(
        `Connected: ${address.substring(0, 6)}...${address.substring(38)}`
      );
    } catch (err) {
      toast.error(`Connection failed: ${err.message}`);
    }
  };

  // Start voting handler
  const handleStartVoting = async () => {
    try {
      setLoading(true);
      await startVoting(votingDuration);
      setVotingActive(true);
      const endTime = await getVotingEndTime();
      setVotingEndTime(endTime);
      toast.success(`Voting started for ${votingDuration} minutes`);
      setLoading(false);
    } catch (err) {
      toast.error(`Failed to start voting: ${err.reason || err.message}`);
      setLoading(false);
    }
  };

  // End voting handler
  const handleEndVoting = async () => {
    try {
      setLoading(true);
      await endVoting();
      setVotingActive(false);
      setVotingEndTime(null);
      toast.success("Voting ended successfully");
      setLoading(false);
    } catch (err) {
      toast.error(`Failed to end voting: ${err.reason || err.message}`);
      setLoading(false);
    }
  };

  // Add candidate handler
  const handleAddCandidate = async () => {
    if (!newCandidateName.trim()) {
      toast.error("Please enter a candidate name");
      return;
    }

    try {
      setLoading(true);
      await addCandidate(newCandidateName);
      const allCandidates = await getAllCandidates();
      setCandidates(allCandidates);
      setNewCandidateName("");
      toast.success(`Candidate "${newCandidateName}" added successfully`);
      setLoading(false);
    } catch (err) {
      toast.error(`Failed to add candidate: ${err.reason || err.message}`);
      setLoading(false);
    }
  };

  // Delete candidate handler
  const handleDeleteCandidate = async (candidateId) => {
    try {
      setLoading(true);
      await deleteCandidate(candidateId);
      const allCandidates = await getAllCandidates();
      setCandidates(allCandidates);
      toast.success(`Candidate #${candidateId} deleted successfully`);
      setLoading(false);
    } catch (err) {
      toast.error(`Failed to delete candidate: ${err.reason || err.message}`);
      setLoading(false);
    }
  };

  // Register voter handler
  const handleRegisterVoter = async () => {
    if (!voterAddress.trim()) {
      toast.error("Please enter a voter address");
      return;
    }

    try {
      setLoading(true);
      await registerVoter(voterAddress);
      setVoterAddress("");
      toast.success(`Voter ${voterAddress} registered successfully`);
      setLoading(false);
    } catch (err) {
      toast.error(`Failed to register voter: ${err.reason || err.message}`);
      setLoading(false);
    }
  };

  // Vote handler
  const handleVote = async (candidateId) => {
    try {
      setLoading(true);
      await vote(candidateId);
      const allCandidates = await getAllCandidates();
      setCandidates(allCandidates);
      const votes = await getTotalVotes();
      setTotalVotes(votes);
      toast.success(`Vote cast for candidate #${candidateId} successfully`);
      setLoading(false);
    } catch (err) {
      toast.error(`Failed to vote: ${err.reason || err.message}`);
      setLoading(false);
    }
  };

  // Set up event listeners
  useEffect(() => {
    if (!isConnected) return;

    const voteCastListener = listenToVoteCast(({ voter, candidateId }) => {
      toast.info(
        `New vote cast for candidate #${candidateId} by ${voter.substring(
          0,
          6
        )}...`
      );
      // Refresh data
      getAllCandidates().then(setCandidates);
      getTotalVotes().then(setTotalVotes);
    });

    const votingStartedListener = listenToVotingStarted(
      ({ duration, endTime }) => {
        toast.success(`Voting started for ${duration} minutes`);
        setVotingActive(true);
        setVotingEndTime(endTime);
      }
    );

    return () => {
      voteCastListener();
      votingStartedListener();
    };
  }, [isConnected]);

  // Initialize on mount
  useEffect(() => {
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center animate-pulse">
          <FaSpinner className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" />
          <p className="text-purple-800 font-medium">
            Loading voting portal...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-purple-100 max-w-md w-full">
          <FaExclamationCircle className="mx-auto h-12 w-12 text-purple-500 mb-4" />
          <p className="text-purple-800 text-xl mb-6">{error}</p>
          <button
            onClick={init}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Format voting end time
  const formattedEndTime = votingEndTime?.toLocaleString() || "Not active";

  return (
    <div className="min-h-screen bg-white bg-[radial-gradient(circle_at_50%_50%,_rgba(192,132,252,0.1)_0%,_rgba(255,255,255,1)_70%)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-900">Voting DApp</h1>
            <p className="text-purple-600">
              {totalVotes} total votes | {candidates.length} candidates
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {account ? (
              <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                <FaUserShield
                  className={isAdmin ? "text-purple-700" : "text-purple-500"}
                />
                <span className="text-purple-800 font-medium">
                  {account.substring(0, 6)}...{account.substring(38)}
                  {isAdmin && (
                    <span className="ml-2 text-xs bg-purple-700 text-white px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Connect Wallet
              </button>
            )}

            {votingActive && (
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                <FaLockOpen className="text-green-600" />
                <span className="text-green-800 font-medium">
                  Voting Active
                </span>
              </div>
            )}

            {!votingActive && (
              <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full">
                <FaLock className="text-red-600" />
                <span className="text-red-800 font-medium">Voting Closed</span>
              </div>
            )}
          </div>
        </header>

        {/* Admin Panel */}
        {isAdmin && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 mb-8">
            <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
              <FaUserShield className="text-purple-700" /> Admin Panel
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Voting Control */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-3">
                  Voting Control
                </h3>
                {!votingActive ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={votingDuration}
                        onChange={(e) => setVotingDuration(e.target.value)}
                        className="border border-purple-200 rounded px-3 py-2 w-20"
                        min="1"
                        placeholder="Minutes"
                      />
                      <span className="text-purple-700">minutes</span>
                    </div>
                    <button
                      onClick={handleStartVoting}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded flex items-center gap-2 w-full justify-center"
                    >
                      <FaCheckCircle /> Start Voting
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEndVoting}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded flex items-center gap-2 w-full justify-center"
                  >
                    <FaExclamationCircle /> End Voting
                  </button>
                )}
              </div>

              {/* Candidate Management */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-3">
                  Candidate Management
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    className="border border-purple-200 rounded px-3 py-2 w-full"
                    placeholder="Candidate name"
                  />
                  <button
                    onClick={handleAddCandidate}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded flex items-center gap-2 w-full justify-center"
                  >
                    <FaPlusCircle /> Add Candidate
                  </button>
                </div>
              </div>

              {/* Voter Management */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-3">
                  Voter Management
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={voterAddress}
                    onChange={(e) => setVoterAddress(e.target.value)}
                    className="border border-purple-200 rounded px-3 py-2 w-full"
                    placeholder="Voter address"
                  />
                  <button
                    onClick={handleRegisterVoter}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center gap-2 w-full justify-center"
                  >
                    <FaUserPlus /> Register Voter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voting Status */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-purple-100 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <FaInfoCircle className="text-purple-600 text-xl" />
              <div>
                <h3 className="font-semibold text-purple-800">Voting Status</h3>
                <p className="text-purple-600">
                  {votingActive
                    ? `Voting ends at: ${formattedEndTime}`
                    : "Voting is not currently active"}
                </p>
              </div>
            </div>
            {votingActive && (
              <div className="flex items-center gap-2">
                <FaClock className="text-purple-500" />
                <span className="text-purple-700 font-medium">
                  {Math.floor((votingEndTime - new Date()) / (1000 * 60))}{" "}
                  minutes remaining
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Candidates List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
            <FaVoteYea className="text-purple-700" /> Candidates
          </h2>

          {candidates.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-purple-100 text-center">
              <p className="text-purple-600">No candidates available</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-white p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-purple-200 relative group"
                >
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteCandidate(candidate.id)}
                      className="absolute top-3 right-3 p-2 text-red-500 hover:text-red-700 transition-colors"
                      title="Delete candidate"
                    >
                      <FaTrash />
                    </button>
                  )}

                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-purple-100 text-purple-800 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                          {candidate.id}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 truncate">
                            {candidate.name}
                          </h2>
                          <p className="text-sm text-purple-600">
                            ID: {candidate.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-400 to-indigo-500 h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.min(
                                100,
                                (candidate.voteCount / (totalVotes || 1)) * 100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-purple-800 whitespace-nowrap">
                          {candidate.voteCount} votes
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleVote(candidate.id)}
                      disabled={!votingActive || !account}
                      className={`relative overflow-hidden py-2 px-5 sm:py-3 sm:px-6 rounded-full font-medium text-white transition-all duration-300 ${
                        votingActive && account
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 cursor-pointer"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FaVoteYea />
                        {!account
                          ? "Connect wallet to vote"
                          : !votingActive
                          ? "Voting closed"
                          : "Vote"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
