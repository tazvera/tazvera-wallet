// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
}

/// @title  Tazvera TZV Lock
/// @notice Locks TZV for one beneficiary. Nothing can be taken out before the cliff ends.
///         After the cliff, TZV unlocks evenly (day by day) over the vesting period.
///         If the vesting period is 0, everything unlocks at the end of the cliff.
///         No owner, no admin, no way to change the beneficiary or the dates.
///         TZV token: 0x4cC2d29b65E6a2cd788a144a81e5e99bd892dE73 (Shardeum Mainnet)
contract TazveraLock {
    IERC20 public constant TOKEN = IERC20(0x4cC2d29b65E6a2cd788a144a81e5e99bd892dE73);

    string public name;              // e.g. "Founder lock"
    address public immutable beneficiary;
    uint256 public immutable start;  // deploy time
    uint256 public immutable cliffEnd;
    uint256 public immutable vestingEnd;
    uint256 public released;

    event Released(address indexed to, uint256 amount);

    /// @param lockName      a short label shown on the explorer, e.g. "Founder lock"
    /// @param _beneficiary  the only address that can ever receive the TZV
    /// @param cliffDays     days fully locked (e.g. 365)
    /// @param vestingDays   days of even unlocking after the cliff (e.g. 1095); 0 = all at cliff end
    constructor(string memory lockName, address _beneficiary, uint256 cliffDays, uint256 vestingDays) {
        require(_beneficiary != address(0), "Lock: zero beneficiary");
        require(cliffDays > 0, "Lock: cliff must be at least 1 day");
        name = lockName;
        beneficiary = _beneficiary;
        start = block.timestamp;
        cliffEnd = block.timestamp + cliffDays * 1 days;
        vestingEnd = cliffEnd + vestingDays * 1 days;
    }

    /// @notice Total TZV ever put in this lock (still locked + already released).
    function totalAllocation() public view returns (uint256) {
        return TOKEN.balanceOf(address(this)) + released;
    }

    /// @notice TZV unlocked so far (including what was already released).
    function vestedAmount(uint256 timestamp) public view returns (uint256) {
        uint256 total = totalAllocation();
        if (timestamp < cliffEnd) return 0;
        if (timestamp >= vestingEnd) return total;
        return (total * (timestamp - cliffEnd)) / (vestingEnd - cliffEnd);
    }

    /// @notice TZV that can be released right now.
    function releasable() public view returns (uint256) {
        return vestedAmount(block.timestamp) - released;
    }

    /// @notice Sends all unlocked TZV to the beneficiary. Anyone may call it; TZV only goes to the beneficiary.
    function release() external {
        uint256 amount = releasable();
        require(amount > 0, "Lock: nothing to release yet");
        released += amount;
        require(TOKEN.transfer(beneficiary, amount), "Lock: transfer failed");
        emit Released(beneficiary, amount);
    }
}
