import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Combined import
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import WalletInfo from "./components/WalletInfo";
import CandidateList from "./components/CandidateList";
import Footer from "./components/Footer";
import WelcomeScreen from "./components/WelcomeScreen";
import AdminPanel from "./components/AdminPanel";
import {
  connectWallet,
  getCurrentAccount,
  isVoterRegistered,
  getVotingStatus,
  registerVoter,
  startVoting,
  endVoting,
  addCandidate,
  vote,
  getAllCandidates,
} from "./components/VotingContract";
import "./style.css";

const App = () => {
  // Core Application State
  const [account, setAccount] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [votingActive, setVotingActive] = useState(false);
  const [votingEndTime, setVotingEndTime] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);

  // Initialize Application
  useEffect(() => {
    const init = async () => {
      try {
        const address = await getCurrentAccount();
        if (address) {
          setAccount(address);
          await Promise.all([
            checkRegistration(address),
            checkVotingStatus(),
            loadCandidates(),
          ]);
          checkAdminStatus(address);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Failed to initialize application");
      } finally {
        setLoading(false);
      }
    };

    init();

    // Listen for account changes
    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || "");
      if (accounts[0]) {
        init();
      } else {
        resetState();
      }
    };

    window.ethereum?.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  // Helper Functions
  const resetState = () => {
    setIsRegistered(false);
    setVotingActive(false);
    setVotingEndTime(null);
    setIsAdmin(false);
    setCandidates([]);
  };

  const checkRegistration = async (address) => {
    try {
      const registered = await isVoterRegistered(address);
      setIsRegistered(registered);
    } catch (error) {
      console.error("Registration check failed:", error);
      throw error;
    }
  };

  const checkVotingStatus = async () => {
    try {
      const { isActive, endTime } = await getVotingStatus();
      setVotingActive(isActive);
      setVotingEndTime(new Date(endTime * 1000)); // Convert from seconds to milliseconds
    } catch (error) {
      console.error("Voting status check failed:", error);
      throw error;
    }
  };

  const loadCandidates = async () => {
    try {
      const candidatesList = await getAllCandidates();
      setCandidates(candidatesList);
    } catch (error) {
      console.error("Failed to load candidates:", error);
      throw error;
    }
  };

  const checkAdminStatus = (address) => {
    setIsAdmin(address === import.meta.env.VITE_ADMIN_ADDRESS);
  };

  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      const address = await connectWallet();
      setAccount(address);
      await checkRegistration(address);
      checkAdminStatus(address);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      // Show user-friendly message based on error.reason
      const message =
        error.reason && error.reason.includes("MetaMask is not installed")
          ? "Please install MetaMask extension"
          : error.reason && error.reason.includes("connect to MetaMask")
          ? "Please connect your MetaMask account"
          : "Wallet connection failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      await registerVoter(account);
      setIsRegistered(true);
      toast.success("Successfully registered as voter!");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (candidateId) => {
    try {
      setLoading(true);
      await vote(candidateId);
      await loadCandidates();
      toast.success("Vote cast successfully!");
    } catch (error) {
      console.error("Voting failed:", error);
      toast.error(`Voting failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Admin functions
  const handleStartVoting = async (durationMinutes) => {
    try {
      setLoading(true);
      await startVoting(durationMinutes);
      await checkVotingStatus();
      toast.success(`Voting started for ${durationMinutes} minutes`);
    } catch (error) {
      console.error("Failed to start voting:", error);
      toast.error(`Failed to start voting: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEndVoting = async () => {
    try {
      setLoading(true);
      await endVoting();
      await checkVotingStatus();
      toast.success("Voting ended successfully");
    } catch (error) {
      console.error("Failed to end voting:", error);
      toast.error(`Failed to end voting: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (name) => {
    try {
      setLoading(true);
      await addCandidate(name);
      await loadCandidates();
      toast.success(`Candidate "${name}" added successfully`);
    } catch (error) {
      console.error("Failed to add candidate:", error);
      toast.error(`Failed to add candidate: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Loading screen component
  const LoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-lg text-purple-700">Loading voting application...</p>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header
          account={account}
          isAdmin={isAdmin}
          onConnectWallet={handleConnectWallet}
        />

        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                loading ? (
                  <LoadingScreen />
                ) : !account ? (
                  <WelcomeScreen connectWallet={handleConnectWallet} />
                ) : !isRegistered ? (
                  <WalletInfo
                    walletAddress={account}
                    isRegistered={isRegistered}
                    onRegister={handleRegister}
                    loading={loading}
                  />
                ) : (
                  <CandidateList
                    candidates={candidates}
                    votingActive={votingActive}
                    votingEndTime={votingEndTime}
                    onVote={handleVote}
                    loading={loading}
                    isAdmin={isAdmin}
                  />
                )
              }
            />

            {isAdmin && (
              <Route
                path="/admin"
                element={
                  <AdminPanel
                    votingActive={votingActive}
                    onStartVoting={handleStartVoting}
                    onEndVoting={handleEndVoting}
                    onAddCandidate={handleAddCandidate}
                    loading={loading}
                  />
                }
              />
            )}
          </Routes>
        </main>

        <Footer />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
