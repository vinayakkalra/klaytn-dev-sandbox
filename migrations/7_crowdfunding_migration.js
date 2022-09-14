const MyToken = artifacts.require('MyToken')
const Factory = artifacts.require('Factory')

module.exports = function (deployer) {

    deployer.deploy(MyToken, 'MyToken', 'FUN', web3.utils.toWei('1000000000')).then(() => {
        // Record recently deployed contract address to 'deployedAddress' file.
    })
    deployer.deploy(Factory)



}


