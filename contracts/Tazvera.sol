// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title  Tazvera (TZV)
/// @notice Official Tazvera token on Shardeum Mainnet.
///         Fixed supply: all 1,000,000,000 TZV are created once, at deployment.
///         No owner, no admin, no minting, no pausing, no fees, no blacklist.
///         Website: https://tazvera.com
contract Tazvera {
    string public constant name = "Tazvera";
    string public constant symbol = "TZV";
    uint8 public constant decimals = 18;
    uint256 public immutable totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        uint256 supply = 1_000_000_000 * 10 ** uint256(decimals);
        totalSupply = supply;
        balanceOf[msg.sender] = supply;
        emit Transfer(address(0), msg.sender, supply);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        require(spender != address(0), "TZV: approve to zero address");
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) {
            require(allowed >= value, "TZV: allowance too low");
            unchecked { allowance[from][msg.sender] = allowed - value; }
            emit Approval(from, msg.sender, allowed - value);
        }
        _transfer(from, to, value);
        return true;
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(to != address(0), "TZV: transfer to zero address");
        uint256 bal = balanceOf[from];
        require(bal >= value, "TZV: balance too low");
        unchecked {
            balanceOf[from] = bal - value;
            balanceOf[to] += value;
        }
        emit Transfer(from, to, value);
    }
}
