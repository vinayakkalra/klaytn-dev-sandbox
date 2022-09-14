const fs = require('fs')
var Token = artifacts.require('Token')
var Factory = artifacts.require('Factory');

module.exports = function (deployer) {
    deployer.deploy(Token, 'TestToken', 'TST', web3.utils.toWei('1000000000'));
    deployer.deploy(Factory);

}