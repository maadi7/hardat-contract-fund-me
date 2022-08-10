const networkConfig = {
    31337: {
        name: "localhost",
    },
    4:{
        name: "rinkeby",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
    },
    137:{
        name:"polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945"
    }
}

const developmentChains = ["hardhat", "localhost"]



module.exports = {
    networkConfig,
    developmentChains,
}