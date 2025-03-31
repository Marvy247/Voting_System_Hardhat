import React, { useEffect, useState } from "react";
import { getAllCandidates, getTotalVotes } from "./votingContractIntegration";

const VotingResultsPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const allCandidates = await getAllCandidates();
      const votes = await getTotalVotes();
      setCandidates(allCandidates);
      setTotalVotes(votes);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Voting Results</h1>
      <h2>Total Votes: {totalVotes}</h2>
      <h4>Results:</h4>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name} - Votes: {candidate.voteCount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotingResultsPage;
