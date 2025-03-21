import React from "react";
import { FaSpinner } from "react-icons/fa";

const WalletInfo = ({
  walletAddress,
  isRegistered,
  onRegister,
  loading,
  onNavigateToVotes,
}) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
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

      <div className="relative z-10 text-center p-8 mx-10 bg-gray-800 bg-opacity-80 rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50">
        <p className="text-lg text-white font-medium mb-2">
          Please Register To Vote!
        </p>
        <p className="text-sm text-white mb-6">
          Your Participation Is Important.
        </p>
        <p className="text-xl font-bold text-purple-300 mb-4 animate-pulse">
          {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
        </p>

        {isRegistered ? (
          <>
            <p className="text-green-400 mt-6 mb-3 font-semibold animate-bounce">
              You are registered!
            </p>
            <button
              onClick={onNavigateToVotes} // Call the function here
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl hover:shadow-purple-500/50"
              aria-label="Go to Votes"
            >
              Go to Votes
            </button>
          </>
        ) : (
          <div className="mt-6">
            <p className="text-red-400 font-semibold mb-4">
              You are not registered.
            </p>
            <button
              onClick={onRegister}
              className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl hover:shadow-purple-500/50 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
              aria-label="Register your wallet"
            >
              {loading ? (
                <div className="flex items-center">
                  <FaSpinner className="animate-spin h-5 w-5 mr-3 text-white" />
                  Registering...
                </div>
              ) : (
                "Register"
              )}
            </button>
          </div>
        )}
      </div>
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
    </div>
  );
};

export default WalletInfo;
