import React, { useState } from "react";
import Header from "./Header"; // Import Header
import Footer from "./Footer"; // Import Footer
import WelcomeScreen from "./WelcomeScreen";
import Dashboard from "./Dashboard";
import CandidateManagement from "./CandidateManagement";
import VotingPage from "./VotingPage";
import VotingResultsPage from "./VotingResultsPage";
import { connectWallet } from "./votingContractIntegration"; // Import the connectWallet function

function App() {
  const [userAddress, setUserAddress] = useState(null);
  const [currentPage, setCurrentPage] = useState("welcome");

  // Modal state
  const [isAddCandidateModalOpen, setAddCandidateModalOpen] = useState(false);
  const [isManageCandidateModalOpen, setManageCandidateModalOpen] =
    useState(false);
  const [isAddVoteModalOpen, setAddVoteModalOpen] = useState(false);

  const handleWalletConnect = async () => {
    const address = await connectWallet();
    setUserAddress(address);
    setCurrentPage("dashboard");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "welcome":
        return <WelcomeScreen onConnect={handleWalletConnect} />;
      case "dashboard":
        return (
          <Dashboard
            setCurrentPage={setCurrentPage}
            setAddCandidateModalOpen={setAddCandidateModalOpen}
            setManageCandidateModalOpen={setManageCandidateModalOpen}
            setAddVoteModalOpen={setAddVoteModalOpen}
          />
        );
      case "votingPage":
        return <VotingPage userAddress={userAddress} />;
      case "votingResults":
        return <VotingResultsPage />;
      default:
        return <WelcomeScreen onConnect={handleWalletConnect} />;
    }
  };

  return (
    <>
      <Header /> {/* Include Header */}
      {renderPage()}
      <Footer /> {/* Include Footer */}
    </>
  );
}

export default App;
