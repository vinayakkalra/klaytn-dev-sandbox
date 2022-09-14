// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@klaytn/contracts/KIP/token/KIP7/KIP7.sol";


contract MyToken is KIP7 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) KIP7(name, symbol) {     
        _mint(msg.sender, initialSupply);
        
    }
}
