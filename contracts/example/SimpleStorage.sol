// A variable to store (x)
// A variable (count) to check the number of times a variable (x) value has been change.
// An address variable that tells us what address was responsible for the latest change in the value of store variable (x)
// Create a mapping to store the latest changes done by an address
// Create and show tests

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 valueStore;
    uint256 count = 0;
    address updatedBy;

    mapping(address=>uint256) tracker;

    function store(uint256 _value) public {
        valueStore = _value;
        count = count + 1;
        updatedBy = msg.sender;
    }

    function getCount() public view returns(uint256){
        return count;
    }

    function getValueStore() public view returns(uint256){
        return valueStore;
    }

    function getUpdatedBy() public view returns(address){
        return updatedBy;
    }


}
