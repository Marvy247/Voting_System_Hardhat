import React, { useEffect, useState, useMemo } from "react";
import {
  FaVoteYea,
  FaShieldAlt,
  FaChartBar,
  FaUserCheck,
  FaClock,
  FaChevronDown,
  FaWallet,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = ({ account, onConnect }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  // Memoize features to prevent unnecessary re-renders
  const features = useMemo(
    () => [
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
    ],
    []
  );

  // Auto-rotate features - disabled if reduced motion preferred
  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length, prefersReducedMotion]);

  // Skip to app if already connected
  useEffect(() => {
    if (account) {
      navigate("/dashboard");
    }
  }, [account, navigate]);

  const handleConnectWallet = async () => {
    if (account) {
      navigate("/dashboard");
      return;
    }

    setIsConnecting(true);
    try {
      await onConnect();
      navigate("/dashboard");
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Simplified background animation for mobile
  const BackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden">
      {/* Static noise texture - removed animation */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-gray-900/30"></div>

      {/* Simplified floating circles - only on desktop */}
      {!prefersReducedMotion && (
        <>
          <div className="hidden md:block absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/20 blur-xl animate-float-slow"></div>
          <div className="hidden md:block absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-500/20 blur-xl animate-float-medium"></div>
          <div className="hidden md:block absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-pink-500/15 blur-lg animate-float-fast"></div>
        </>
      )}
    </div>
  );

  // CSS animation classes for better performance
  const globalStyles = `
    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(10%, 5%); }
    }
    .animate-float-slow { animation: float 15s ease-in-out infinite; }
    .animate-float-medium { animation: float 20s ease-in-out infinite; }
    .animate-float-fast { animation: float 25s ease-in-out infinite reverse; }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <main className="relative min-h-screen w-full py-10 flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 overflow-hidden">
        <BackgroundElements />

        <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 sm:mb-8"
              >
                <motion.div
                  animate={
                    prefersReducedMotion ? {} : { rotate: [0, 20, -20, 0] }
                  }
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="inline-block"
                >
                  <FaVoteYea className="mx-auto lg:mx-0 w-16 sm:w-20 h-12 sm:h-16 text-purple-400" />
                </motion.div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Welcome To{" "}
                  <span className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold">
                    BlockVote
                  </span>
                </h1>

                <h2 className="text-xl sm:text-2xl text-gray-300 mb-4 sm:mb-6">
                  Secure. Transparent. Unchangeable.
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0"
              >
                BlockVote revolutionizes elections by leveraging blockchain
                technology to ensure every vote is counted, verified, and
                immutable.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-purple-500/30 text-sm sm:text-base"
                >
                  {account ? (
                    <>
                      <FaCheckCircle className="mr-2" />
                      Connected
                    </>
                  ) : isConnecting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                  className="bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-900/30 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-full flex items-center justify-center transition-all duration-300 hover:border-purple-400 hover:text-purple-200 text-sm sm:text-base"
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

            <div className="flex-1 max-w-md w-full mt-8 sm:mt-0">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-700 shadow-xl"
              >
                <div className="mb-4 sm:mb-6">
                  {features[currentFeature].icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                  {features[currentFeature].title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  {features[currentFeature].description}
                </p>
                <div className="flex mt-4 sm:mt-6 space-x-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                        currentFeature === index
                          ? "bg-purple-500"
                          : "bg-gray-600"
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
                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                className="mt-8 sm:mt-12 overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: prefersReducedMotion ? 0 : index * 0.1,
                      }}
                      className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
                    >
                      <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

export default WelcomeScreen;
