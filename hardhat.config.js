require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.17",
  networks: {
    anvil: {
      url: "http://127.0.0.1:8545",
      chainId: 31337, // Anvil's default chain ID
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Private key of Anvil's first account
      ],
    },
  },
};
