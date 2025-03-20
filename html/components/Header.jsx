import React from "react";

const Header = ({ connectWallet }) => {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold">Voting Platform</h1>
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Connect Wallet
      </button>
    </header>
  );
};

export default Header;
