const Factory = artifacts.require("Factory");
const Token = artifacts.require("Token");
const Project = artifacts.require("Project");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Factory", function ( accounts ) {

  // we will need a factory instance and a token instance
  // we will need to set the initial values of token address and freetokensperproject

  let factory, token;
  beforeEach(async () => {
    factory = await Factory.deployed();
    token = await Token.deployed();

    // set token address in factory
    await factory.setTokenAddress(token.address, {from: accounts[0]});

    // set the freeTokensPerProject
    await factory.setFreetokenPerProject(web3.utils.toWei('1000'));

    // We need to credit the  tokens to the contract
    await token.transfer(factory.address, web3.utils.toWei('10000'), {from: accounts[0]});

  })

  // Check if the above values are set properly
  it("Checking the set values", async function () {
    // check if the supply of the token is a 1000000000
    var supply = await token.totalSupply();
    assert.equal(web3.utils.fromWei(supply), '1000000000')

    // check if the token address is set
    var tokenAddress = await factory.getTokenAddress();
    assert.equal(tokenAddress, token.address);

    // check if the free token amounts are set
    var freeToken = await factory.getFreetokenPerProject();
    assert.equal(web3.utils.fromWei(freeToken), '1000');

    // check if the contract is sent some tokens
    var balance = await factory.getTokenbalance();
    assert.equal(web3.utils.fromWei(balance), '10000')

  });

  it("Check if a project is credited with token", async function () {
    await factory.createProject(web3.utils.toWei('0.1'), web3.utils.toWei('10'), "project URI");
    var projectId = await factory.projects(0);
    var balance = await factory.getTokenBalanceOfAddress(projectId);
    assert.equal('1000', web3.utils.fromWei(balance));

  });

  it("Check if we can contribute to the project with lesser than minimum value", async function () {
    var projectId = await factory.projects(0);
    var project = await Project.at(projectId);
    project.contribute({from: accounts[1], value: web3.utils.toWei('0.01')}).catch((e)=>{
      assert(true);
    })
  });

  it("Check if we can contribute to the project and send tokens", async function () {
    var projectId = await factory.projects(0);
    var project = await Project.at(projectId);
    await project.contribute({from: accounts[1], value: web3.utils.toWei('1')})

    var balance = await factory.getTokenBalanceOfAddress(accounts[1]);
    assert.equal(web3.utils.fromWei(balance), '1')

  });

  // check withdrawal
  it("check withdrawal", async function() {

    // check if only the owner is able to call this function
    var projectId = await factory.projects(0);
    var project = await Project.at(projectId);
    project.withdraw({from:accounts[1]}).catch((e)=>{
      assert(true)
    })
    var initialbalance = await web3.eth.getBalance(accounts[0]);
    await project.withdraw({from:accounts[0]})
    var finalbalance = await web3.eth.getBalance(accounts[0])
    console.log('initialbalance', initialbalance)
    console.log('finalbalance', finalbalance)
    assert(Number(web3.utils.fromWei(finalbalance)) > Number(web3.utils.fromWei(initialbalance)));
    // Oracles, yield protocols, proxy contracts/upgradable contracts


  });


});
