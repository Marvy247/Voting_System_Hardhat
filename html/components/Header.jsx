import React from "react";
import { FaVoteYea } from "react-icons/fa"; // Importing the voting icon

const Header = ({ connectWallet }) => {
  return (
    <header className="bg-white text-purple-800 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <FaVoteYea className="w-10 h-10 text-purple-900" />
        <h1 className="text-xl font-bold ml-2">BlockVote</h1>
      </div>
      <button
        onClick={connectWallet}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold  rounded-full px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
      >
        Connect Wallet
      </button>
    </header>
  );
};

export default Header;
