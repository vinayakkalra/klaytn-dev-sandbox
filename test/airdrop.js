const { default: Web3 } = require("web3");

const Airdrop = artifacts.require("Airdrop");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Airdrop", function (accounts) {
  let airdropInstance;
  
  beforeEach(async () => {
    airdropInstance = await Airdrop.deployed();
  })

  it("Check if deposits happen successfully", async function () {
    await airdropInstance.deposit({from: accounts[0], value: web3.utils.toWei('10')})
    let balance = await airdropInstance.getBalance();
    assert.equal(balance.toString(), '10000000000000000000');
  });

  it("Deposit from another account", async function () {
    airdropInstance.deposit({from: accounts[1], value: web3.utils.toWei('1')}).then().catch((e)=>{
      assert(true)
    })
  });

  it("Airdrop is successful", async function () {
    var initialBalance = await web3.eth.getBalance(accounts[0])
    var iniContractBalance = await airdropInstance.getBalance()
    await airdropInstance.airdrop({from: accounts[0]})
    var finalBalance = await web3.eth.getBalance(accounts[0])
    var finalContractBalance = await airdropInstance.getBalance()
    assert(initialBalance<finalBalance)

    var iniKlay = await web3.utils.fromWei(iniContractBalance)
    var finKlay = await web3.utils.fromWei(finalContractBalance)
    assert.equal( Number(iniKlay), (Number(finKlay) + 1))

  });

  it("If airdrop could be done twice", async function () {
    
    await airdropInstance.airdrop({from: accounts[0]})
    await airdropInstance.airdrop({from: accounts[0]}).catch((e)=>{
      assert(true)
    })
    

  });


});
