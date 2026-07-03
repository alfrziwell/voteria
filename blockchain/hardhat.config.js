require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      // Default local hardhat network
    },
    pbftPermissioned: {
      url: "https://pbft-rpc.voteria.university.ac.id", // Placeholder RPC url for PBFT Permissioned Blockchain
      chainId: 9988,                                  // Custom Chain ID
      accounts: [
        "0xdf57089febbacf7ba0bc227dafb7510d0ec1d603f55e5100062f4e3c4d7e98a1" // Placeholder private key for Election Committee/Admin
      ],
    },
  },
};
