import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import WalletInfo from "./components/WalletInfo";
import CandidateList from "./components/CandidateList";
import Footer from "./components/Footer";
import WelcomeScreen from "./components/WelcomeScreen";
import "/style.css";

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCandidateList, setShowCandidateList] = useState(false); // State to control visibility of CandidateList
  const [candidates, setCandidates] = useState([
    { id: 1, name: "Candidate 1", voteCount: 0 },
    { id: 2, name: "Candidate 2", voteCount: 0 },
    { id: 3, name: "Candidate 3", voteCount: 0 },
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        setWalletAddress(address);
        setIsRegistered(false); // Simulate not registered
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("Please install MetaMask to use this application.");
    }
  };

  // Handle registration
  const handleRegister = () => {
    setLoading(true); // Start loading
    setTimeout(() => {
      setIsRegistered(true); // Simulate registration
      setLoading(false); // End loading
    }, 2000); // Simulate a 2-second delay
  };

  // Navigate to CandidateList
  const handleNavigateToVotes = () => {
    setShowCandidateList(true); // Show CandidateList component
  };

  // Handle voting
  const handleVote = (candidateId) => {
    setSelectedCandidate(candidateId);
    // Simulate voting logic (update vote count)
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, voteCount: candidate.voteCount + 1 }
          : candidate
      )
    );
    alert(`Voted for Candidate ${candidateId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header connectWallet={connectWallet} />
      <div className="flex-grow flex flex-col items-center justify-center">
        {!walletAddress ? (
          <WelcomeScreen connectWallet={connectWallet} />
        ) : showCandidateList ? ( // Conditionally render CandidateList
          <CandidateList
            candidates={candidates}
            selectedCandidate={selectedCandidate}
            onVote={handleVote} // Pass the voting function
          />
        ) : (
          <WalletInfo
            walletAddress={walletAddress}
            isRegistered={isRegistered}
            onRegister={handleRegister}
            loading={loading}
            onNavigateToVotes={handleNavigateToVotes} // Pass the navigation function
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
