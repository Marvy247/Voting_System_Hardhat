import React from "react";

const WelcomeScreen = ({ connectWallet }) => {
  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-semibold">
        Welcome to the Voting Platform!
      </h2>
      <p className="mt-2">Please connect your wallet to get started.</p>
      <button
        onClick={connectWallet}
        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default WelcomeScreen;
