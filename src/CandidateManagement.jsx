import React, { useState, useEffect } from "react";
import {
  addCandidate,
  deleteCandidate,
  getAllCandidates,
} from "./votingContractIntegration";

const CandidateManagement = () => {
  const [candidateName, setCandidateName] = useState("");
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const allCandidates = await getAllCandidates();
    setCandidates(allCandidates);
  };

  const handleAddCandidate = async () => {
    await addCandidate(candidateName);
    setCandidateName("");
    fetchCandidates();
  };

  const handleDeleteCandidate = async (candidateId) => {
    await deleteCandidate(candidateId);
    fetchCandidates();
  };

  return (
    <div>
      <h1>Candidate Management</h1>
      <input
        type="text"
        value={candidateName}
        onChange={(e) => setCandidateName(e.target.value)}
        placeholder="Candidate Name"
      />
      <button onClick={handleAddCandidate}>Add Candidate</button>
      <h4>Current Candidates:</h4>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name}
            <button onClick={() => handleDeleteCandidate(candidate.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidateManagement;
