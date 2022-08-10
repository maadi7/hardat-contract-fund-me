const {networkConfig, developmentChains} = require("../helper-hardhat-config")
const {network} = require("hardhat");
const {verify} = require("../utils/verify")

module.exports = async ({getNamedAccounts, deployments}) =>{
    const {deploy, log} = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    }else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

//ethUsdPriceFeed
  
    const args = [ethUsdPriceFeedAddress]; 
    const fundMe = await deploy("FundMe",{
        from:deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,

    })
    log("________________-------------------__________________")

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    
}
module.exports.tags = ["all", 'fundme']