import React, { useEffect, useState } from "react";
import { getAllCandidates, vote, hasVoted } from "./votingContractIntegration";

const VotingPage = ({ userAddress }) => {
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const allCandidates = await getAllCandidates();
      setCandidates(allCandidates);
      const hasUserVoted = await hasVoted(userAddress);
      setVoted(hasUserVoted);
    };

    fetchData();
  }, [userAddress]);

  const handleVote = async (candidateId) => {
    await vote(candidateId);
    setVoted(true);
  };

  return (
    <div>
      <h1>Voting Page</h1>
      {voted ? (
        <p>Thank you for voting!</p>
      ) : (
        <div>
          <h4>Select a candidate to vote:</h4>
          <ul>
            {candidates.map((candidate) => (
              <li key={candidate.id}>
                {candidate.name}
                <button onClick={() => handleVote(candidate.id)}>Vote</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VotingPage;
