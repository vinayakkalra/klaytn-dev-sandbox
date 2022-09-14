// crowdfunding platform
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@klaytn/contracts/KIP/token/KIP7/IKIP7.sol";

contract Project {

    uint256 klayBalance = 0;
    address owner;
    uint256 public minimumValue;
    uint256 public targetValue;
    string public projectURI;
    address tokenAddress;
    

    mapping(address => uint256) klayFunderAddress;

    modifier onlyOwner {
        require(msg.sender == owner, "Must be Owner");
        _;
    }

    constructor (uint256 _minimum, uint256 _target, string memory _projectURI, address _creator, address _tokenAddress){
        owner = _creator;
        minimumValue = _minimum;
        targetValue = _target;
        projectURI = _projectURI;
        tokenAddress = _tokenAddress;

    }

    // Function to deposit klay from a user in the contract
    function contribute() public payable {
        require(msg.value >= minimumValue, "Should send more than the mimum value");
        klayBalance = klayBalance + msg.value;
        klayFunderAddress[msg.sender] = klayFunderAddress[msg.sender] + msg.value;
        IKIP7 tokenInterface = IKIP7(tokenAddress);
        if(tokenInterface.balanceOf(address(this)) >= msg.value){
            tokenInterface.transfer(msg.sender, msg.value);
        }
    }

    // function to get the contributions of a token address
    function getContributionAmount(address _contributer) public view returns(uint256){
        return klayFunderAddress[_contributer];
    }

    // function that could only be used by contract creator to withdraw funds
    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(klayBalance);
        klayBalance = 0;
    }

    // function to get klay balance
    function getKlayBalance() public view returns(uint256) {
        return klayBalance;
    }

    // function to get owner
    function getOwner() public view returns(address){
        return owner;
    }

}