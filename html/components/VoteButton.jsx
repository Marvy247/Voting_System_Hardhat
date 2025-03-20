import React from "react";

const VoteButton = ({ handleVote, selectedCandidate }) => {
  return (
    <button
      onClick={handleVote}
      className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      disabled={!selectedCandidate}
    >
      Cast Vote
    </button>
  );
};

export default VoteButton;
