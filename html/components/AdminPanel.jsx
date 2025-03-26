import React, { useState } from "react";
import {
  FaUserPlus,
  FaPlay,
  FaStop,
  FaTrash,
  FaSpinner,
  FaUserTie,
  FaClock,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminPanel = ({
  votingActive,
  onStartVoting,
  onEndVoting,
  onAddCandidate,
  loading,
}) => {
  const [candidateName, setCandidateName] = useState("");
  const [votingDuration, setVotingDuration] = useState(60); // Default 60 minutes
  const [activeTab, setActiveTab] = useState("election");

  const handleAddCandidate = () => {
    if (!candidateName.trim()) {
      toast.error("Please enter a candidate name");
      return;
    }
    onAddCandidate(candidateName);
    setCandidateName("");
  };

  const handleStartVoting = () => {
    if (votingDuration < 1) {
      toast.error("Voting duration must be at least 1 minute");
      return;
    }
    onStartVoting(votingDuration);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaUserTie className="mr-3 text-purple-600" />
          Election Administration
        </h1>
        <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
          <div
            className={`h-3 w-3 rounded-full ${
              votingActive ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm font-medium">
            {votingActive ? "Voting Active" : "Voting Inactive"}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("election")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "election"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Election Control
          </button>
          <button
            onClick={() => setActiveTab("candidates")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "candidates"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Candidate Management
          </button>
          <button
            onClick={() => setActiveTab("voters")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "voters"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Voter Management
          </button>
        </nav>
      </div>

      {/* Election Control Tab */}
      {activeTab === "election" && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaClock className="mr-2 text-purple-500" />
              Voting Period
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voting Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={votingDuration}
                  onChange={(e) =>
                    setVotingDuration(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="flex items-end space-x-4">
                {!votingActive ? (
                  <button
                    onClick={handleStartVoting}
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaPlay className="mr-2" />
                    )}
                    Start Voting
                  </button>
                ) : (
                  <button
                    onClick={onEndVoting}
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaStop className="mr-2" />
                    )}
                    End Voting
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-start text-sm text-gray-500">
              <FaInfoCircle className="flex-shrink-0 mr-2 mt-0.5 text-purple-400" />
              <p>
                Starting voting will begin the election period. Only registered
                voters will be able to participate during this time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Management Tab */}
      {activeTab === "candidates" && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Candidate
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter candidate's full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAddCandidate}
                  disabled={loading}
                  className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <FaUserPlus className="mr-2" />
                  )}
                  Add Candidate
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Current Candidates
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Votes
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Example candidate - replace with actual data */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      1
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      John Doe
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      42
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-red-600 hover:text-red-900">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Voter Management Tab */}
      {activeTab === "voters" && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Registered Voters
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Registration Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Example voter - replace with actual data */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      0x7f...3a4b
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Oct 15, 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-red-600 hover:text-red-900">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
