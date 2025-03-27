import React from "react";
import { BrowserProvider } from "ethers";

const WalletConnector = ({ onConnect }) => {
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error(
          "MetaMask is not installed. Please install it to continue."
        );
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error(
          "No accounts found. Please ensure MetaMask is unlocked."
        );
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      onConnect(address); // Call the onConnect prop with the connected address
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert(error.message); // Show error message to the user
    }
  };

  return (
    <button
      onClick={connectWallet}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
    >
      Connect Wallet
    </button>
  );
};

export default WalletConnector;
