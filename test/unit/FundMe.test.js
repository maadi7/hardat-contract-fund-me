const { ethers, deployments, getNamedAccounts } = require("hardhat");
const {assert, expect} = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip:
describe("FundMe", async function(){
   
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("1"); //1 ETH
    beforeEach(async function (){
      deployer = (await getNamedAccounts()).deployer;

      await deployments.fixture(["all"]);
      fundMe = await ethers.getContract("FundMe", deployer);
      mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);

    });

    describe("constructor", async function(){
        it("set aggregator address correctly", async function(){
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address);
        })
    });

    describe("fund", async function(){
        it("Fails if not enough ETH!!", async ()=>{
            await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
        });

        it("check the amount funded by the user", async () =>{
            await fundMe.fund({value: sendValue});
            const res = await fundMe.addressToAmountFunded(deployer);
            assert.equal(res.toString(), sendValue.toString());
        })

        it("add funders to array", async ()=>{
            await fundMe.fund({value: sendValue});
            const res = await fundMe.funders(0);
            assert.equal(res, deployer);
        });
 
    });

    describe("withdraw", async function(){
        beforeEach(async function (){
            await fundMe.fund({value: sendValue})
        });

        it("withdraw ETH from the deployer", async function(){
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);
            
            const {gasUsed, effectiveGasPrice} = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice);

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
            
            assert.equal(endingFundMeBalance, 0);
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString, endingDeployerBalance.add(gasCost).toString)
            

        });

        it("allows to withdraw from multiple users", async function(){
            //create accounts and funding 
            const accounts = await ethers.getSigners();
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(accounts[i]);
                await fundMeConnectedContract.fund({value: sendValue});
            }
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);  
            const {gasUsed, effectiveGasPrice} = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice);

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
            
            assert.equal(endingFundMeBalance, 0);
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString, endingDeployerBalance.add(gasCost).toString)

            await expect(fundMe.funders(0)).to.be.reverted;

            for(let i = 1; i<6; i++){
                assert.equal(await fundMe.addressToAmountFunded(accounts[i].address), 0);
            }

        });

        it("only owner can withdraw", async function(){

            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerConnectedContract = await fundMe.connect(attacker);
            await expect(attackerConnectedContract.withdraw()).to.be.reverted

        })
    })

    
} )