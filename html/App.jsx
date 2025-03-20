import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import WalletInfo from "./components/WalletInfo";
import CandidateList from "./components/CandidateList";
import VoteButton from "./components/VoteButton";
import Footer from "./components/Footer";
import WelcomeScreen from "./components/WelcomeScreen";
import "/style.css";

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [candidates, setCandidates] = useState([
    "Candidate 1",
    "Candidate 2",
    "Candidate 3",
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState("");

  const connectWallet = () => {
    // Simulate wallet connection
    const address = "0x1234567890abcdef"; // Placeholder for wallet address
    setWalletAddress(address);
    // Check registration status (simulated)
    setIsRegistered(false); // Simulate not registered
  };

  const handleVote = () => {
    // Simulate voting logic
    console.log(`Voted for: ${selectedCandidate}`);
  };

  const handleRegister = () => {
    // Simulate registration logic
    setIsRegistered(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header connectWallet={connectWallet} />
      <div className="flex-grow flex flex-col items-center justify-center">
        {!walletAddress ? (
          <WelcomeScreen connectWallet={connectWallet} />
        ) : (
          <>
            <WalletInfo
              walletAddress={walletAddress}
              isRegistered={isRegistered}
              onRegister={handleRegister}
            />
            {isRegistered && (
              <CandidateList
                candidates={candidates}
                selectedCandidate={selectedCandidate}
                setSelectedCandidate={setSelectedCandidate}
              />
            )}
            {isRegistered && (
              <VoteButton
                handleVote={handleVote}
                selectedCandidate={selectedCandidate}
              />
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
