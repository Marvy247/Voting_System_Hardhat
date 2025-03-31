import React, { useEffect, useState } from "react";
import {
  FaVoteYea,
  FaShieldAlt,
  FaChartBar,
  FaUserCheck,
  FaClock,
  FaChevronDown,
  FaWallet,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = ({ account, onWalletConnected }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

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

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await onWalletConnected();
    } finally {
      setIsConnecting(false);
    }
  };

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

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-gray-900/30"></div>

        {/* Visible floating circles */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/20 blur-xl"
        ></motion.div>

        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-500/20 blur-xl"
        ></motion.div>

        {/* Additional smaller circle */}
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-pink-500/15 blur-lg"
        ></motion.div>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block"
              >
                <FaVoteYea className="mx-auto lg:mx-0 w-16 h-16 text-purple-400 mb-4" />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Welcome To BlockVote
              </h1>
              <h2 className="text-2xl sm:text-3xl text-gray-300 mb-6">
                Secure. Transparent. Unchangeable.
              </h2>
            </motion.div>

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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
              >
                {isConnecting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  <>
                    <FaWallet className="mr-2" /> Connect Wallet
                  </>
                )}
              </button>
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-900/30 font-medium py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 hover:border-purple-400 hover:text-purple-200"
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

          <div className="flex-1 max-w-md">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 shadow-xl"
            >
              <div className="mb-6">{features[currentFeature].icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {features[currentFeature].title}
              </h3>
              <p className="text-gray-300">
                {features[currentFeature].description}
              </p>
              <div className="flex mt-6 space-x-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentFeature === index ? "bg-purple-500" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {showFeatures && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-12 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
                  >
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default WelcomeScreen;
