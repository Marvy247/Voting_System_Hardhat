import React, { useState, useEffect } from "react";
import WalletConnector from "./WalletConnector"; // Import the new WalletConnector component
import {
  FaVoteYea,
  FaWallet,
  FaShieldAlt,
  FaChartBar,
  FaUserCheck,
  FaClock,
  FaArrowRight,
  FaChevronDown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = ({ connectWallet, account, isAdmin }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);
  const navigate = useNavigate();

  // In your WelcomeScreen component
  {
    !window.ethereum && (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              MetaMask not detected.{" "}
              <a
                href="https://metamask.io/download.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline text-yellow-700 hover:text-yellow-600"
              >
                Install MetaMask
              </a>{" "}
              to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Features carousel
  const features = [
    {
      icon: <FaShieldAlt className="text-4xl text-purple-500" />,
      title: "Tamper-Proof Voting",
      description:
        "Every vote is securely recorded on the blockchain, making fraud impossible.",
    },
    {
      icon: <FaChartBar className="text-4xl text-blue-500" />,
      title: "Real-Time Results",
      description:
        "Watch live vote tallies and see results the moment voting ends.",
    },
    {
      icon: <FaUserCheck className="text-4xl text-green-500" />,
      title: "Verified Identity",
      description:
        "Only registered voters can participate, ensuring election integrity.",
    },
    {
      icon: <FaClock className="text-4xl text-yellow-500" />,
      title: "Time-Limited Voting",
      description: "Voting periods are strictly enforced by smart contracts.",
    },
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Skip to app if already connected
  useEffect(() => {
    if (account) {
      navigate("/vote");
    }
  }, [account, navigate]);

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 opacity-95"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-500"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
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
      <div className="relative z-10 w-full max-w-6xl px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column - Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Logo & Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <FaVoteYea className="mx-auto lg:mx-0 w-16 h-16 text-purple-400 mb-4" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Welcome To BlockVote
              </h1>
              <h2 className="text-2xl sm:text-3xl text-gray-300 mb-6">
                Secure. Transparent. Unchangeable.
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              BlockVote revolutionizes elections by leveraging blockchain
              technology to ensure every vote is counted, verified, and
              immutable.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <WalletConnector
                onConnect={(address) => console.log("Connected:", address)}
              />{" "}
              {/* Use the new WalletConnector component */}
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-900/30 font-medium py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300"
              >
                Learn More
                <FaChevronDown
                  className={`ml-2 transition-transform ${
                    showFeatures ? "transform rotate-180" : ""
                  }`}
                />
              </button>
            </motion.div>
          </div>

          {/* Right Column - Feature Showcase */}
          <div className="flex-1 max-w-md">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-4">{features[currentFeature].icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {features[currentFeature].title}
                  </h3>
                  <p className="text-gray-300">
                    {features[currentFeature].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Feature Indicators */}
              <div className="flex justify-center mt-6 gap-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentFeature === index
                        ? "bg-purple-500 w-6"
                        : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Expanded Features Section */}
        <AnimatePresence>
          {showFeatures && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-12 overflow-hidden"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-colors"
                  >
                    <div className="text-purple-400 mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* How It Works Section */}
              <div className="mt-12 text-center">
                <h3 className="text-2xl font-bold text-white mb-6">
                  How BlockVote Works
                </h3>
                <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-4xl mx-auto">
                  {[
                    {
                      step: "1",
                      title: "Connect Wallet",
                      desc: "Link your crypto wallet to verify identity",
                    },
                    {
                      step: "2",
                      title: "View Candidates",
                      desc: "See who's running in the current election",
                    },
                    {
                      step: "3",
                      title: "Cast Your Vote",
                      desc: "Select your choice securely on the blockchain",
                    },
                    {
                      step: "4",
                      title: "See Results",
                      desc: "Watch real-time results after voting ends",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-6 relative overflow-hidden group"
                    >
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-500/10 rounded-full"></div>
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500/10 rounded-full"></div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                          {item.step}
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-300">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <WalletConnector
                  onConnect={(address) => console.log("Connected:", address)}
                />{" "}
                {/* Use the new WalletConnector component */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default WelcomeScreen;
