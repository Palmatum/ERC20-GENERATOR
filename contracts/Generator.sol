//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";

contract Generator is Ownable {
    function createToken(
        uint256 _supply,
        string memory _name,
        string memory _symbol
    ) public returns (address) {
        Token token = new Token(_supply, _name, _symbol);
        address tokenAddress = token.getAddress();
        return tokenAddress;
    }

    function destroy() public {
        require(msg.sender == owner(), "You are not the owner");
        selfdestruct(payable(owner()));
    }
}
