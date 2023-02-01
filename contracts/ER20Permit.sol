// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "solmate/src/tokens/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ERC20Permit is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals
    ) ERC20(_name, _symbol, _decimals) {
        _mint(msg.sender, 1000000000000000000000000);
    }
}
