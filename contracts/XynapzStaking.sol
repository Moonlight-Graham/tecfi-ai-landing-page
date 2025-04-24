// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XNAPZStaking is Ownable {
    IERC20 public immutable xnapz;

    uint256 public constant APY = 50; // 50% APY
    uint256 public constant STAKING_CAP = 100_000_000 * 10**6; // 100M XNAPZ max
    uint256 public constant LOCK_PERIOD = 7 days;

    uint256 public totalStaked;

    struct StakeInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastUpdate;
        uint256 lockUntil;
    }

    mapping(address => StakeInfo) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 reward);

    constructor(IERC20 _vdto) Ownable(msg.sender) {
        xnapz = _xnapz;
    }
