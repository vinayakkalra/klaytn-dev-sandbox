const KIP7Token = artifacts.require("KIP7Token");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("KIP7Token", function (accounts) {

  it("should assert true", async function () {
    await KIP7Token.deployed();
    return assert.isTrue(true);
  });

  it("Check balance", async function () {
    const kip7 = await KIP7Token.deployed();
    const balance = await kip7.balanceOf(accounts[0]);
    assert.equal(balance.toString(), '1000000000');
  });

  it("Transfer tokens", async function () {
    const kip7 = await KIP7Token.deployed();
    await kip7.transfer(accounts[1], 100000, {from: accounts[0]})
    const balance = await kip7.balanceOf(accounts[1]);
    assert.equal(balance.toString(), '100000');
  });

  
});
