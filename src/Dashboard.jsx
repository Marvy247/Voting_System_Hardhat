import React, { useEffect, useState } from "react";
import {
  getAllCandidates,
  isVotingActive,
  getTotalVotes,
} from "./votingContractIntegration";

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [votingActive, setVotingActive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const allCandidates = await getAllCandidates();
      const votes = await getTotalVotes();
      const votingStatus = await isVotingActive();
      setCandidates(allCandidates);
      setTotalVotes(votes);
      setVotingActive(votingStatus);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Total Votes: {totalVotes}</h2>
      <h3>Voting Status: {votingActive ? "Active" : "Inactive"}</h3>
      <h4>Candidates:</h4>
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

export default Dashboard;
