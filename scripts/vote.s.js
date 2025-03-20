require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "^0.8.26",
  networks: {
    anvil: {
      chainId: 31337, // Change to 1337 to avoid conflict with Anvil
    },
  },
};
