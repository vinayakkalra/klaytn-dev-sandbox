const fs = require('fs')
var Token = artifacts.require('Token')
var Factory = artifacts.require('Factory');
var Project = artifacts.require('Project')

module.exports = function (deployer) {
    deployer.deploy(Token, 'TestToken', 'TST', web3.utils.toWei('1000000000'));
    deployer.deploy(Factory).then(() => {
        if (Factory._json) {
            fs.mkdir('./src/deployed', { recursive: true }, (err) => {
                if (err) throw err
            })
            // Save factory file to deployedABI.
            fs.writeFile(
                './src/deployed/factoryabi',
                JSON.stringify(Factory._json.abi, 2),
                (err) => {
                    if (err) throw err
                    console.log(`The abi of ${Factory._json.contractName} is recorded on deployedABI file`)
                }
            )

            // Save project file to deployedABI.
            fs.writeFile(
                './src/deployed/projectabi',
                JSON.stringify(Project._json.abi, 2),
                (err) => {
                    if (err) throw err
                    console.log(`The abi of ${Project._json.contractName} is recorded on deployedABI file`)
                }
            )
        }
        fs.writeFile('./src/deployed/factoryaddress', Factory.address, (err) => {
            if (err) throw err
            console.log(
                `The deployed contract address * ${Factory.address} * is recorded on deployedAddress file`
            )
        })
    });

}