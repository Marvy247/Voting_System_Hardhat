import React, { useState } from "react";
import { FaTimes, FaUserEdit, FaTrash, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { deleteCandidate, addCandidate } from "./votingContractIntegration";

const ManageCandidateModal = ({ candidate, onClose, account }) => {
  const [name, setName] = useState(candidate.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState("view"); // 'view', 'edit', 'delete'

  const handleDelete = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const tx = await deleteCandidate(parseInt(candidate.id));
      console.log("Delete transaction:", tx);
      setSuccess(`Candidate "${candidate.name}" deleted successfully!`);
      setTimeout(onClose, 2000); // Close modal after success
    } catch (err) {
      console.error("Error deleting candidate:", err);
      setError(err.message || "Failed to delete candidate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Candidate name cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      // First delete the old candidate
      await deleteCandidate(parseInt(candidate.id));
      // Then add the updated candidate
      const tx = await addCandidate(name);
      console.log("Update transaction:", tx);
      setSuccess(`Candidate updated to "${name}" successfully!`);
      setTimeout(onClose, 2000); // Close modal after success
    } catch (err) {
      console.error("Error updating candidate:", err);
      setError(err.message || "Failed to update candidate");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <FaUserEdit className="text-blue-400" />
              {mode === "view" && "Manage Candidate"}
              {mode === "edit" && "Edit Candidate"}
              {mode === "delete" && "Confirm Deletion"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              <FaTimes />
            </button>
          </div>

          {mode === "view" && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Candidate ID</label>
                <div className="bg-gray-700 px-4 py-2 rounded-lg">
                  {candidate.id}
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Current Name</label>
                <div className="bg-gray-700 px-4 py-2 rounded-lg">
                  {candidate.name}
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">
                  Votes Received
                </label>
                <div className="bg-gray-700 px-4 py-2 rounded-lg">
                  {candidate.voteCount}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setMode("edit")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <FaUserEdit /> Edit
                </button>
                <button
                  onClick={() => setMode("delete")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          )}

          {mode === "edit" && (
            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="editName"
                    className="block text-gray-400 mb-1"
                  >
                    New Name
                  </label>
                  <input
                    id="editName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new name"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
                    {success}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setMode("view")}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    disabled={isSubmitting || name.trim() === candidate.name}
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
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaCheck /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {mode === "delete" && (
            <div className="space-y-4">
              <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-300">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-bold">{candidate.name}</span>? This
                  action cannot be undone.
                </p>
                <p className="text-red-400 mt-2 text-sm">
                  Note: This will remove all votes associated with this
                  candidate.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
                  {success}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setMode("view")}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
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
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash /> Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

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

export default ManageCandidateModal;
