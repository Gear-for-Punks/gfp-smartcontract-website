require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const { MAINNET_GATEWAY_URL, GOERLI_GATEWAY_URL, RINKEBY_GATEWAY_URL, DEPLOYMENT_WALLET_PRIVATE_KEY } = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",

  networks: {
    hardhat: {},
    ganache: {
      url: "http://127.0.0.1:7545/",
      saveDeployments: true
    },
    // Uncommennt Below before deploymennt to deploy to testnets
    // goerli: {
    //   url: GOERLI_GATEWAY_URL,
    //   accounts: [`0x${DEPLOYMENT_WALLET_PRIVATE_KEY}`]
    // },
    // rinkeby: {
    //   url: RINKEBY_GATEWAY_URL,
    //   accounts: [`0x${DEPLOYMENT_WALLET_PRIVATE_KEY}`]
    // },
    mainnet: {
      url: MAINNET_GATEWAY_URL,
      accounts: [`0x${DEPLOYMENT_WALLET_PRIVATE_KEY}`]
    },
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },

  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
