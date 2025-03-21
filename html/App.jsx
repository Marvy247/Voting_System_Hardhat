import React, { useState } from "react";
import CandidateList from "./components/CandidateList"; // Import CandidateList component
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import WalletInfo from "./components/WalletInfo";
import VoteButton from "./components/VoteButton";
import Footer from "./components/Footer";
import WelcomeScreen from "./components/WelcomeScreen";
import "/style.css";

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCandidateList, setShowCandidateList] = useState(false); // State to control visibility of CandidateList
  const [candidates, setCandidates] = useState([
    "Candidate 1",
    "Candidate 2",
    "Candidate 3",
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState("");

  const connectWallet = () => {
    const address = "0x1234567890abcdef"; // Simulated wallet address
    setWalletAddress(address);
    setIsRegistered(false); // Simulate not registered
  };

  const handleRegister = () => {
    setLoading(true); // Start loading
    setTimeout(() => {
      setIsRegistered(true); // Simulate registration
      setLoading(false); // End loading
    }, 2000); // Simulate a 2-second delay
  };

  const handleNavigateToVotes = () => {
    setShowCandidateList(true); // Show CandidateList component
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
            setSelectedCandidate={setSelectedCandidate}
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
