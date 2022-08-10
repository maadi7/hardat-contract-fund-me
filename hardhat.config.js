require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan")
require("solidity-coverage")
require("hardhat-deploy")
/** @type import('hardhat/config').HardhatUserConfig */


const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL 
const PRIVATE_KEY = process.env.PRIVATE_KEY 
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY



module.exports = {
  solidity: {
    compilers: [{version:"0.8.8"}, {version: "0.6.6"}]
  },
  networks: {
    hardhat: {
        chainId: 31337,
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
      blockConfirmations: 6,
  },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
};
