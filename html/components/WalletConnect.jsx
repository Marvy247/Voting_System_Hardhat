import React from "react";

const WalletConnect = ({ connectWallet }) => {
  return (
    <button
      onClick={connectWallet}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Connect Wallet
    </button>
  );
};

export default WalletConnect;
