import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import WelcomeScreen from "./WelcomeScreen";
import Dashboard from "./Dashboard";
import CandidateManagement from "./CandidateManagement";
import VotingPage from "./VotingPage";
import VotingResultsPage from "./VotingResultsPage";
import { connectWallet } from "./votingContractIntegration";

function App() {
  const [userAddress, setUserAddress] = useState(null);
  const [isAddCandidateModalOpen, setAddCandidateModalOpen] = useState(false);
  const [isManageCandidateModalOpen, setManageCandidateModalOpen] =
    useState(false);
  const [isAddVoteModalOpen, setAddVoteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("welcome"); // New state for current page

  const handleWalletConnect = async () => {
    const address = await connectWallet();
    if (address) {
      setUserAddress(address);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <WelcomeScreen
                onConnect={handleWalletConnect}
                userAddress={userAddress}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                userAddress={userAddress}
                setCurrentPage={setCurrentPage} // Pass setCurrentPage to Dashboard
                setAddCandidateModalOpen={setAddCandidateModalOpen}
                setManageCandidateModalOpen={setManageCandidateModalOpen}
                setAddVoteModalOpen={setAddVoteModalOpen}
              />
            }
          />
          <Route
            path="/voting"
            element={<VotingPage userAddress={userAddress} />}
          />
          <Route path="/results" element={<VotingResultsPage />} />
          <Route
            path="/manage-candidates"
            element={<CandidateManagement userAddress={userAddress} />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
