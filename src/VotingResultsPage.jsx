import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaChartBar, FaChartPie, FaVoteYea, FaSpinner } from "react-icons/fa";
import { getAllCandidates, getTotalVotes } from "./votingContractIntegration";

const VotingResultsPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allCandidates, votes] = await Promise.all([
          getAllCandidates(),
          getTotalVotes(),
        ]);
        setCandidates(allCandidates);
        setTotalVotes(votes);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sort candidates by vote count (descending)
  const sortedCandidates = [...candidates].sort(
    (a, b) => b.voteCount - a.voteCount
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-200 flex items-center justify-center gap-3">
            <FaChartBar className="text-blue-100" /> Election Results
          </h1>
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center gap-4">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <div className="text-3xl font-bold text-gray-800">
                  {totalVotes.toLocaleString()}
                </div>
                <div className="text-gray-600 text-lg">Total Votes Cast</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FaChartPie className="text-purple-500" /> Detailed Results
          </h2>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-5 w-48 bg-gray-200 rounded"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gray-300 h-3 rounded-full"
                      style={{ width: `${Math.random() * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedCandidates.map((candidate) => {
                const percentage =
                  totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;

                return (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-gray-800">
                          {candidate.name}
                        </div>
                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          ID: {candidate.id}
                        </div>
                      </div>
                      <div className="font-bold text-gray-800">
                        {candidate.voteCount.toLocaleString()} votes
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {percentage.toFixed(1)}% of total
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Winner Section */}
        {!loading && sortedCandidates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-6 border border-blue-100"
          >
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaVoteYea className="text-yellow-500" /> Current Leader
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white rounded-full p-4 shadow-lg border-4 border-yellow-400">
                <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center text-4xl font-bold text-yellow-500">
                  {sortedCandidates[0].name.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {sortedCandidates[0].name}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {sortedCandidates[0].voteCount.toLocaleString()} votes
                  </div>
                  <div className="text-lg text-gray-600">
                    {totalVotes > 0
                      ? `${(
                          (sortedCandidates[0].voteCount / totalVotes) *
                          100
                        ).toFixed(1)}%`
                      : "0%"}{" "}
                    of total
                  </div>
                </div>
                <div className="mt-4 text-gray-600">
                  Leading the election with a{" "}
                  {totalVotes > 0
                    ? `${(
                        (sortedCandidates[0].voteCount / totalVotes) * 100 -
                        (sortedCandidates[1]?.voteCount / totalVotes) * 100
                      ).toFixed(1)}%`
                    : "0%"}{" "}
                  margin
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VotingResultsPage;
