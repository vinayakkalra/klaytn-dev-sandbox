// Create a contract that will have a mapping of addresses that are sent an airdrop of 1 Klay (every unique user will be airdroped 1 Klay)
// Once an address is Airdropped, it should not be sent Klay again
// Create a deploy script on truffle to create the contract and fund the contract with 10 klay
// Create tests to confirm the deployments

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Airdrop {

    uint256 airdropAmount = 1 * 10 ** 18; // 1 klay
    mapping(address => bool) airdropMapping;
    uint256 balance = 0;
    address owner;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function airdrop() public {
        if(airdropMapping[msg.sender] == false && balance >= airdropAmount){
            payable(msg.sender).transfer(airdropAmount);
            balance = balance - airdropAmount;
            airdropMapping[msg.sender] = true;
        }
    }

    function hasAirdroped() public view returns(bool){
        return airdropMapping[msg.sender];
    }

    function deposit() public payable onlyOwner {
        balance = balance + msg.value;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }


}