const { AccessTuple } = require("caver-js");

const Token = artifacts.require("MyToken");
const Factory = artifacts.require("Factory")
const Project = artifacts.require("Project")

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Factory", function (accounts) {
    
    let factory, token;

    beforeEach(async () => {
        // deploy factory and token
        factory = await Factory.deployed();
        token = await Token.deployed();

        // set the initial values of factory
        await factory.setTokenAddress(token.address, {from: accounts[0]});
        await factory.setFreeTokensPerProject(web3.utils.toWei('10000'), {from: accounts[0]})

        // fund the factory with the token amount
        await token.transfer(factory.address, web3.utils.toWei('100000'), {from: accounts[0]})
        
    })

    it("making the initial set of rules", async function () {
        var supply = await token.totalSupply()
        var tokenAddress = await factory.getTokenAddress();
        var freeTokensPerProject = await factory.getFreeTokensPerProject();

        // Check if the supply of the token is the same as we mentioned in the migration
        assert.equal(supply.toString(), (web3.utils.toWei('1000000000')).toString())

        // Check if the token address is set properly
        assert.equal(token.address, tokenAddress);

        // check if the amount of free tokens per project is set properly
        assert.equal(web3.utils.toWei('10000'), freeTokensPerProject);

        // check if the tokens were transferred to the contract address
        var bal = await factory.getTokenBalance();
        assert.equal(bal.toString(), web3.utils.toWei('100000'))

        
    });

    it("Create a project and check if the tokens are sent to the contract", async function() {
        await factory.createProject(web3.utils.toWei('0.1'), web3.utils.toWei('10'), "hello"), {from: accounts[0]};
        var projectId = await factory.projects(0);
        var balance = await factory.getBalanceOfAccount(projectId);
        assert.equal(web3.utils.toWei('10000'), balance.toString());
    });

    it("Create a project and check if the tokens are sent to the contract", async function() {
        await factory.createProject(web3.utils.toWei('0.1'), web3.utils.toWei('10'), "hello"), {from: accounts[0]};
        var projectId = await factory.projects(0);
        var balance = await factory.getBalanceOfAccount(projectId);
        assert.equal(web3.utils.toWei('10000'), balance.toString());
    });

    it("Contribute more than the minimum amount to the project", async function() {
        var projectId = await factory.projects(0);
        var projectInstance = await Project.at(projectId);
        projectInstance.contribute({from: accounts[0], value: web3.utils.toWei('0.01')}).then((e)=>{
            assert(false);
        }).catch((e) =>{
            assert(true);
        });
    });
    
    it("Contribute and check if the tokens are creditied", async function() {
        var projectId = await factory.projects(0);
        var projectInstance = await Project.at(projectId);
        await projectInstance.contribute({from: accounts[1], value: web3.utils.toWei('1')});
        var contributionAmount = await projectInstance.getContributionAmount(accounts[1]);
        assert.equal(contributionAmount.toString(), web3.utils.toWei('1'));
        var bal = await token.balanceOf(accounts[1])
        assert.equal(bal.toString(), web3.utils.toWei('1'))
    });

    it("Check withdrawal", async function() {
        var projectId = await factory.projects(0);
        var projectInstance = await Project.at(projectId);
        var klayBalance = await projectInstance.getKlayBalance();
        console.log('klayBalance', klayBalance);
        var initialbalance = await web3.eth.getBalance(accounts[0])
        await projectInstance.withdraw({from:accounts[0]});
        var finalbalance = await web3.eth.getBalance(accounts[0]);
        console.log(Number(web3.utils.fromWei(initialbalance)));
        console.log(Number(web3.utils.fromWei(finalbalance)));
    });


});
