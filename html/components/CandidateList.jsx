import React from "react";

const CandidateList = ({
  candidates,
  selectedCandidate,
  setSelectedCandidate,
}) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold">Candidates</h2>
      <ul className="mt-2">
        {candidates.map((candidate, index) => (
          <li key={index} className="flex items-center mt-2">
            <input
              type="radio"
              name="candidate"
              value={candidate}
              onChange={() => setSelectedCandidate(candidate)}
              className="mr-2"
            />
            <label>{candidate}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidateList;
