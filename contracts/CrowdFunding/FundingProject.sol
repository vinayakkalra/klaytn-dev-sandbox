// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@klaytn/contracts/KIP/token/KIP7/IKIP7.sol";

contract Project {

    // this will create the logic for a singular project to fund
    uint256 minimumAmount; 
    uint256 targetAmount;
    string projectURI;
    uint256 klaybalance=0;
    address owner;
    uint256 totalklayfunded = 0;
    address tokenAddress;

    mapping (address => uint256) funderAddresses;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }


    constructor(uint256 _minimumAmount, uint256 _targetAmount, string memory _projectURI, address _creator, address _tokenAddress) {
        minimumAmount = _minimumAmount;
        targetAmount = _targetAmount;
        projectURI = _projectURI;
        owner = _creator;
        tokenAddress = _tokenAddress;
    }

    // contribute function which will be responsible for contributions to this project
    function contribute() public payable {
        require(msg.value >= minimumAmount);
        klaybalance = klaybalance + msg.value;
        totalklayfunded = totalklayfunded + msg.value;
        funderAddresses[msg.sender] = funderAddresses[msg.sender] + msg.value;
        IKIP7 token = IKIP7(tokenAddress);
        if(token.balanceOf(address(this)) >= msg.value){
            token.transfer(msg.sender, msg.value);
        }
    }

    // function to check contributions of a particular address
    function getContribution(address _user) public view returns(uint256) {
        return funderAddresses[_user];
    }

    // function to get the owner of the project
    function getOwner() public view returns(address){
        return owner;
    }


    // function to withdraw the amount which would be owner only
    function withdraw() public onlyOwner {
        payable(owner).transfer(klaybalance);
        klaybalance=0;
    }

}