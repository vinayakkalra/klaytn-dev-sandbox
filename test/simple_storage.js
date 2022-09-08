const SimpleStorage = artifacts.require("SimpleStorage");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("SimpleStorage", function (accounts) {
  it("Validating Storage Function", async function () {
    const simpleStorage = await SimpleStorage.deployed();
    await simpleStorage.store(10, {from: accounts[0]})
    const number = await simpleStorage.getValueStore();
    assert.equal(number.toString(), '10');
    const updatedBy = await simpleStorage.getUpdatedBy();
    assert.equal(updatedBy, accounts[0]);
  });

});
