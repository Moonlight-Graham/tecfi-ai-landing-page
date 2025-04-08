// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract TecFiStaking {
    IERC20 public token;

    uint256 public constant APY = 210; // 210% annual yield
    uint256 public constant SECONDS_IN_YEAR = 31536000;
    uint256 public constant LOCK_PERIOD = 7 days;
    uint256 public constant MAX_REWARD_SUPPLY = 800_000_000 ether; // Match TECFI token decimals (18)
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

    modifier updateReward(address user) {
        StakeInfo storage userStake = stakes[user];

        if (userStake.amount > 0) {
            uint256 timeElapsed = block.timestamp - userStake.lastUpdated;
            uint256 pending = (userStake.amount * APY * timeElapsed) / (SECONDS_IN_YEAR * 100);
            
            // Enforce reward cap
            uint256 available = MAX_REWARD_SUPPLY - totalRewardsDistributed;
            if (pending > available) {
                pending = available;
            }

            userStake.rewardDebt += pending;
            totalRewardsDistributed += pending;
        }

        userStake.lastUpdated = block.timestamp;
        _;
    }

    function stake(uint256 amount) external updateReward(msg.sender) {
        require(amount > 0, "Amount must be > 0");
        token.transferFrom(msg.sender, address(this), amount);

        StakeInfo storage userStake = stakes[msg.sender];
        userStake.amount += amount;
        userStake.unlockTime = block.timestamp + LOCK_PERIOD;
    }

    function unstake() external updateReward(msg.sender) {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No tokens staked");
        require(block.timestamp >= userStake.unlockTime, "Tokens are still locked");

        uint256 toUnstake = userStake.amount;
        userStake.amount = 0;

        token.transfer(msg.sender, toUnstake);
    }

    function claimRewards() external updateReward(msg.sender) {
        StakeInfo storage userStake = stakes[msg.sender];
        uint256 reward = userStake.rewardDebt;
        require(reward > 0, "No rewards to claim");

        userStake.rewardDebt = 0;
        token.transfer(msg.sender, reward);
    }

    function calculateReward(address user) external view returns (uint256) {
        StakeInfo memory userStake = stakes[user];

        if (userStake.amount == 0) return userStake.rewardDebt;

        uint256 timeElapsed = block.timestamp - userStake.lastUpdated;
        uint256 pending = (userStake.amount * APY * timeElapsed) / (SECONDS_IN_YEAR * 100);

        uint256 available = MAX_REWARD_SUPPLY - totalRewardsDistributed;
        if (pending > available) {
            pending = available;
        }

        return userStake.rewardDebt + pending;
    }
}
