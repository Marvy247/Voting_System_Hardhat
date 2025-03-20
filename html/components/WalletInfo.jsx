import React from "react";

const WalletInfo = ({ walletAddress, isRegistered, onRegister }) => {
  return (
    <div className="mt-4">
      <p className="text-lg">Wallet Address: {walletAddress}</p>
      {isRegistered ? (
        <p className="text-green-500">You are registered!</p>
      ) : (
        <div>
          <p className="text-red-500">You are not registered.</p>
          <button
            onClick={onRegister}
            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletInfo;
