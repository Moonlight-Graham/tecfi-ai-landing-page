// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingContract {
    IERC20 public token;  // The ERC20 token to stake

    uint256 public constant APY = 50;  // 50% annual yield
    uint256 public constant SECONDS_IN_YEAR = 31536000;
    uint256 public constant LOCK_PERIOD = 7 days;
    uint256 public totalRewardsDistributed;
    uint256 public maxStakingSupply;  // 15% of total supply (liquidity pool cap)
    uint256 public totalStakedAmount;  // Track total staked amount

    struct StakeInfo {
        uint256 amount;
        uint256 lastUpdated;
        uint256 rewardDebt;
        uint256 unlockTime;
    }

    mapping(address => StakeInfo) public stakes;

    event Staked(address indexed user, uint256 amount, uint256 unlockTime);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 rewards);

    constructor(address _token) {
        token = IERC20(_token);
        maxStakingSupply = 1_500_000 * 15 / 100; // 15% of 1,500,000 (225,000 TECFI)
    }

    modifier updateReward(address user) {
        StakeInfo storage userStake = stakes[user];

        if (userStake.amount > 0) {
            uint256 reward = calculateReward(user);
            userStake.rewardDebt += reward;
            totalRewardsDistributed += reward;
        }
        _;
    }

    modifier onlyAfterUnlockTime(address user) {
        require(block.timestamp >= stakes[user].unlockTime, "Tokens are still locked");
        _;
    }

    modifier limitStaking(uint256 amount) {
        require(totalStakedAmount + amount <= maxStakingSupply, "Staking exceeds max allowed supply");
        _;
    }

    function stake(uint256 amount) external updateReward(msg.sender) limitStaking(amount) {
        require(amount > 0, "Cannot stake 0");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        StakeInfo storage userStake = stakes[msg.sender];
        userStake.amount += amount;
        userStake.lastUpdated = block.timestamp;
        userStake.unlockTime = block.timestamp + LOCK_PERIOD;

        totalStakedAmount += amount;  // Update the total staked amount

        emit Staked(msg.sender, amount, userStake.unlockTime);
    }

    function unstake(uint256 amount) external updateReward(msg.sender) onlyAfterUnlockTime(msg.sender) {
        StakeInfo storage userStake = stakes[msg.sender];
        require(amount > 0, "Cannot unstake 0");
        require(userStake.amount >= amount, "Insufficient staked amount");

        uint256 reward = userStake.rewardDebt;
        userStake.amount -= amount;
        userStake.rewardDebt = 0;  // Reset the reward debt after unstaking

        totalStakedAmount -= amount;  // Update the total staked amount

        require(token.transfer(msg.sender, amount), "Transfer failed");
        emit Unstaked(msg.sender, amount, reward);
    }

    function claimRewards() external updateReward(msg.sender) {
        StakeInfo storage userStake = stakes[msg.sender];
        uint256 reward = userStake.rewardDebt;
        require(reward > 0, "No rewards to claim");

        userStake.rewardDebt = 0;  // Reset the reward debt after claiming
        require(token.transfer(msg.sender, reward), "Transfer failed");

        emit RewardsClaimed(msg.sender, reward);
    }

    function calculateReward(address user) public view returns (uint256) {
        StakeInfo storage userStake = stakes[user];
        if (userStake.amount == 0) return 0;

        uint256 stakingDuration = block.timestamp - userStake.lastUpdated;
        uint256 reward = (userStake.amount * APY / 100) * stakingDuration / SECONDS_IN_YEAR;
        return reward;
    }

    function getStakeInfo(address user) external view returns (uint256 amount, uint256 unlockTime, uint256 rewardDebt) {
        StakeInfo storage userStake = stakes[user];
        return (userStake.amount, userStake.unlockTime, userStake.rewardDebt);
    }

    function getTotalStaked() public view returns (uint256) {
        return totalStakedAmount;  // Return the tracked total staked amount
    }
}
