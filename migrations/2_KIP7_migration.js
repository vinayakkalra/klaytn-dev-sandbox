const fs = require('fs')
var kip7Token = artifacts.require('KIP7Token')

module.exports = function (deployer) {
  deployer.deploy(kip7Token, 'TestToken', 'TST', 1000000000).then(() => {
    // Record recently deployed contract address to 'deployedAddress' file.
    if (kip7Token._json) {
      fs.mkdir('./src/deployed', { recursive: true }, (err) => {
        if (err) throw err
      })
      // Save abi file to deployedABI.
      fs.writeFile('./src/deployed/kip7TokenABI', JSON.stringify(kip7Token._json.abi, 2), (err) => {
        if (err) throw err
        console.log(`The abi of ${kip7Token._json.contractName} is recorded on deployedABI file`)
      })
    }
    fs.writeFile('./src/deployed/kip7TokenAddress', kip7Token.address, (err) => {
      if (err) throw err
      console.log(
        `The deployed contract address * ${kip7Token.address} * is recorded on deployedAddress file`
      )
    })
  })
}