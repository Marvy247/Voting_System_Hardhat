require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  networks: {
    anvil: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  solidity: "0.8.17", // Updated version
};
