import React, { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import {
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserPlus,
  FaUserShield,
  FaClipboardList,
  FaLock,
  FaArrowRight,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { registerVoter, getCurrentAccount } from "./VotingContract";

const WalletInfo = ({
  walletAddress,
  isRegistered,
  loading,
  isAdmin,
  refreshStatus,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [voterToRegister, setVoterToRegister] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Format wallet address
  const formattedAddress = `${walletAddress.slice(
    0,
    6
  )}...${walletAddress.slice(-4)}`;

  // Handle voter registration
  const handleRegister = async () => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first.");
      return;
    }

    try {
      setIsRegistering(true);

      // Verify network connection
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== 31337n) {
        throw new Error("Please connect to Anvil network (ChainID: 31337)");
      }

      await registerVoter(walletAddress);
      toast.success("Registration successful!");
      refreshStatus();
    } catch (error) {
      console.error("Registration error:", error);
      const errorMsg = error.reason || error.message;
      toast.error(`Failed: ${errorMsg.replace("execution reverted: ", "")}`);
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle admin registration of other voters
  const handleAdminRegister = async () => {
    if (!voterToRegister) {
      toast.error("Please enter a valid wallet address");
      return;
    }

    try {
      setIsRegistering(true);
      await registerVoter(voterToRegister);
      toast.success(
        `Voter ${voterToRegister.slice(0, 6)}... registered successfully`
      );
      setVoterToRegister("");
      refreshStatus();
    } catch (error) {
      toast.error(`Registration failed: ${error.reason || error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (!isRegistered) return;

    const interval = setInterval(() => {
      // This would be replaced with actual voting end time from contract
      const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // Mock 24h from now
      const remaining = Math.max(0, endTime - new Date());
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRegistered]);

  // Format time remaining
  const formatTime = (ms) => {
    if (!ms) return "00:00:00";

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900 p-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 opacity-95"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-500"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 50],
                y: [0, (Math.random() - 0.5) * 50],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/70 to-blue-900/70 p-5 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <FaUserShield className="text-purple-300" />
              Voter Registration
            </h2>
          </div>

          {/* Wallet Info */}
          <div className="p-6">
            <div className="flex items-center justify-between bg-gray-700/50 rounded-lg px-4 py-3 mb-6">
              <span className="text-sm text-gray-300">Wallet Address</span>
              <span className="font-mono text-purple-300 font-medium">
                {formattedAddress}
              </span>
            </div>

            {/* Registration Status */}
            <div
              className={`p-4 rounded-lg mb-6 ${
                isRegistered
                  ? "bg-green-900/30 border border-green-700"
                  : "bg-red-900/30 border border-red-700"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                {loading ? (
                  <FaSpinner className="animate-spin text-gray-400 text-2xl" />
                ) : isRegistered ? (
                  <FaCheckCircle className="text-green-400 text-2xl" />
                ) : (
                  <FaExclamationCircle className="text-red-400 text-2xl" />
                )}
                <span
                  className={`text-lg font-semibold ${
                    isRegistered ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {loading
                    ? "Checking status..."
                    : isRegistered
                    ? "Registered Voter"
                    : "Not Registered"}
                </span>
              </div>

              {isRegistered && timeRemaining && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <FaClock className="text-yellow-400" />
                  <span className="text-yellow-300 font-mono">
                    Voting time remaining: {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isRegistered && !loading && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    isRegistering
                      ? "bg-purple-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  }`}
                >
                  {isRegistering ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <FaUserPlus />
                      Register to Vote
                    </>
                  )}
                </motion.button>
              )}

              {isRegistered && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (window.location.href = "/vote")}
                  className="w-full py-3 px-4 rounded-lg font-bold bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 flex items-center justify-center gap-2"
                >
                  <FaArrowRight />
                  Proceed to Voting
                </motion.button>
              )}

              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="w-full py-2 px-4 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-purple-300 flex items-center justify-center gap-2"
                >
                  <FaUserShield />
                  {showAdminPanel ? "Hide Admin Panel" : "Show Admin Panel"}
                </button>
              )}
            </div>
          </div>

          {/* Admin Panel */}
          <AnimatePresence>
            {showAdminPanel && isAdmin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900/50 border-t border-gray-700 overflow-hidden"
              >
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                    <FaUserShield />
                    Admin Voter Registration
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      Register Another Voter
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voterToRegister}
                        onChange={(e) => setVoterToRegister(e.target.value)}
                        placeholder="0x..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={handleAdminRegister}
                        disabled={isRegistering}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-4 rounded-lg flex items-center justify-center"
                      >
                        {isRegistering ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaUserPlus />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3 text-sm text-gray-300 border border-gray-700">
                    <div className="flex items-start gap-2">
                      <FaInfoCircle className="text-purple-400 mt-1 flex-shrink-0" />
                      <p>
                        As an admin, you can register voters before the election
                        begins. Only registered voters will be able to
                        participate.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 text-center text-gray-400 text-sm"
        >
          <p>Each wallet address can only register once.</p>
          <p className="mt-1">Voting requires a small gas fee.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default WalletInfo;
