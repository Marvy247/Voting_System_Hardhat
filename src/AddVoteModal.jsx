import React, { useState, useEffect } from "react";
import { FaTimes, FaVoteYea, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { vote } from "./votingContractIntegration";

const AddVoteModal = ({ candidates, selectedCandidate, onClose, account }) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    selectedCandidate ? selectedCandidate.id : ""
  );
  const [voteCount, setVoteCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Set initial selected candidate if provided
  useEffect(() => {
    if (selectedCandidate) {
      setSelectedCandidateId(selectedCandidate.id);
    }
  }, [selectedCandidate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedCandidateId) {
      setError("Please select a candidate");
      return;
    }

    if (voteCount <= 0 || voteCount > 1000) {
      setError("Vote count must be between 1 and 1000");
      return;
    }

    setIsSubmitting(true);
    try {
      // We need to call the vote function multiple times
      // (Note: In a real implementation, you might want a batch vote function in your contract)
      for (let i = 0; i < voteCount; i++) {
        await vote(parseInt(selectedCandidateId));
      }
      setSuccess(`Successfully added ${voteCount} votes to candidate!`);
      setTimeout(onClose, 2000); // Close modal after success
    } catch (err) {
      console.error("Error adding votes:", err);
      setError(err.message || "Failed to add votes");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md relative"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaVoteYea className="text-green-400" /> Add Votes
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">
                Search Candidates
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Search by name..."
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="mb-4 max-h-60 overflow-y-auto">
              <label className="block text-gray-300 mb-2">
                Select Candidate
              </label>
              {filteredCandidates.length > 0 ? (
                <div className="space-y-2">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      onClick={() => setSelectedCandidateId(candidate.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedCandidateId === candidate.id
                          ? "bg-green-900/50 border border-green-700"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{candidate.name}</span>
                        <span className="text-sm text-gray-300">
                          Votes: {candidate.voteCount}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        ID: {candidate.id}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-700 rounded-lg p-4 text-center text-gray-400">
                  No candidates found
                </div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="voteCount" className="block text-gray-300 mb-2">
                Number of Votes to Add
              </label>
              <input
                type="number"
                id="voteCount"
                min="1"
                max="1000"
                value={voteCount}
                onChange={(e) =>
                  setVoteCount(
                    Math.min(1000, Math.max(1, parseInt(e.target.value) || 1))
                  )
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex justify-between mt-1">
                <button
                  type="button"
                  onClick={() => setVoteCount(Math.max(1, voteCount - 1))}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-l-lg"
                  disabled={voteCount <= 1}
                >
                  -
                </button>
                <div className="flex-1 text-center text-sm text-gray-400">
                  {voteCount} vote{voteCount !== 1 ? "s" : ""}
                </div>
                <button
                  type="button"
                  onClick={() => setVoteCount(Math.min(1000, voteCount + 1))}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-r-lg"
                  disabled={voteCount >= 1000}
                >
                  +
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
                {success}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                disabled={isSubmitting || !selectedCandidateId}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaVoteYea /> Add Votes
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400">
            <p>
              Connected as:{" "}
              {account
                ? `${account.substring(0, 6)}...${account.substring(38)}`
                : "Not connected"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddVoteModal;
