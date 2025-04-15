// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
}

contract BraniStaking {
    IERC20 public token;

    uint256 public constant APY = 50; // 50% annual interest
    uint256 public constant SECONDS_IN_YEAR = 31536000;
    uint256 public constant LOCK_PERIOD = 7 days;
    uint256 public constant MAX_REWARD_POOL = 100_000_000 * 10**6; // 100M BRANI with 6 decimals

    uint256 public totalRewardsDistributed;

    struct StakeInfo {
        uint256 amount;
        uint256 lastUpdated;
        uint256 rewardDebt;
        uint256 unlockTime;
    }

    mapping(address => StakeInfo) public stakes;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        StakeInfo storage user = stakes[msg.sender];

        _updateRewards(msg.sender);

        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        user.amount += amount;
        user.lastUpdated = block.timestamp;
        user.unlockTime = block.timestamp + LOCK_PERIOD;
    }

    function claim() external {
        _updateRewards(msg.sender);

        uint256 reward = stakes[msg.sender].rewardDebt;
        require(reward > 0, "No rewards");
        require(totalRewardsDistributed + reward <= MAX_REWARD_POOL, "Reward cap reached");

        stakes[msg.sender].rewardDebt = 0;
        totalRewardsDistributed += reward;

        require(token.transfer(msg.sender, reward), "Transfer failed");
    }

    function unstake() external {
        StakeInfo storage user = stakes[msg.sender];
        require(block.timestamp >= user.unlockTime, "Stake still locked");
        require(user.amount > 0, "Nothing to unstake");

        _updateRewards(msg.sender);

        uint256 amount = user.amount;
        user.amount = 0;
        user.lastUpdated = 0;

        require(token.transfer(msg.sender, amount), "Unstake transfer failed");
    }

    function _updateRewards(address userAddr) internal {
        StakeInfo storage user = stakes[userAddr];
        if (user.amount == 0) return;

        uint256 timeElapsed = block.timestamp - user.lastUpdated;
        uint256 reward = (user.amount * APY * timeElapsed) / (100 * SECONDS_IN_YEAR);

        user.rewardDebt += reward;
        user.lastUpdated = block.timestamp;
    }

    function pendingRewards(address userAddr) external view returns (uint256) {
        StakeInfo storage user = stakes[userAddr];
        if (user.amount == 0) return 0;

        uint256 timeElapsed = block.timestamp - user.lastUpdated;
        uint256 reward = (userStake.amount * APY / 100) * stakingDuration / SECONDS_IN_YEAR;
        return user.rewardDebt + reward;
    }

    function stakedBalance(address userAddr) external view returns (uint256) {
        return stakes[userAddr].amount;
    }

    function unlockTime(address userAddr) external view returns (uint256) {
        return stakes[userAddr].unlockTime;
    }
}