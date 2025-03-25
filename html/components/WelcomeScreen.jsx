import React from "react";
import { FaVoteYea, FaWallet } from "react-icons/fa";

const WelcomeScreen = ({ connectWallet }) => {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Circular Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%] bg-gradient-radial from-gray-900 via-purple-900 to-gray-900 opacity-90 animate-gradient-rotate"
          style={{
            background: `radial-gradient(circle at center, #1F2937, #4C1D95, #1F2937)`,
            animation: "rotateBackground 20s linear infinite",
          }}
        ></div>
      </div>

      {/* Content */}
      <header className="relative z-10 text-center p-8 sm:p-8 max-w-lg mx-6 bg-gray-100 bg-opacity-90 rounded-lg shadow-2xl backdrop-blur-sm border border-gray-800 transform transition-all duration-500 hover:scale-105 hover:shadow-purple-500/30">
        {/* Logo */}
        <FaVoteYea
          className="mx-auto mb-4 w-60 h-20 sm:w-24 sm:h-24 animate-bounce text-purple-800"
          aria-label="BlockVote Logo"
        />

        {/* Heading */}
        <h1 className="text-5xl sm:text-5xl font-bold mb-4 my-4 bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
          Welcome to{" "}
          <span className="text-6xl sm:text-6xl bg-gradient-to-r from-purple-800 to-blue-800 bg-clip-text text-transparent">
            BlockVote
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-lg mb-8 text-gray-700">
          Secure, transparent, and tamper-proof voting powered by blockchain
          technology.
        </p>

        {/* Connect Wallet Button */}
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          aria-label="Connect your wallet"
        >
          <FaWallet className="mr-2" />{" "}
          {/* Replaced Font Awesome with React Icons */}
          Connect Wallet
        </button>
      </header>

      {/* Background Animation Keyframes */}
      <style>
        {`
          @keyframes rotateBackground {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </main>
  );
};

export default WelcomeScreen;
