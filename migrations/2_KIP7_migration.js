const fs = require('fs')
var kip7Token = artifacts.require('KIP7Token')

module.exports = function (deployer) {
  deployer.deploy(kip7Token, 'TestToken', 'TST', 1000000000).then(() => {
    // Record recently deployed contract address to 'deployedAddress' file.
  })
}