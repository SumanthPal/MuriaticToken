// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "./Token.sol";

contract Staking {
    MuriaticToken public token;
    uint256 public rewardRate = 100; // Adjust based on your reward logic

    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public rewardDebt;
    mapping(address => uint256) public lastUpdatedTime;

    event Staked(address indexed user, uint256 amount);
    event UnStaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(MuriaticToken _token) {
        token = _token;
    }

    function calculateRewards(address _user) public view returns (uint256) {
        if (stakedAmount[_user] == 0) return 0;

        uint256 timeElapsed = block.timestamp - lastUpdatedTime[_user];
        return (stakedAmount[_user] * rewardRate * timeElapsed) / 1e18; // Normalize division
    }

    function stake(uint256 _amount) public {
        require(_amount > 0, "Cannot stake 0");

        if (stakedAmount[msg.sender] > 0) {
            uint256 pendingRewards = calculateRewards(msg.sender);
            rewardDebt[msg.sender] += pendingRewards;
        }

        token.transferFrom(msg.sender, address(this), _amount);
        stakedAmount[msg.sender] += _amount;
        lastUpdatedTime[msg.sender] = block.timestamp;

        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) public {
        require(stakedAmount[msg.sender] >= _amount, "Insufficient staked amount");

        uint256 pendingRewards = calculateRewards(msg.sender);
        rewardDebt[msg.sender] += pendingRewards;

        stakedAmount[msg.sender] -= _amount;
        lastUpdatedTime[msg.sender] = block.timestamp;

        token.transfer(msg.sender, _amount);
        emit UnStaked(msg.sender, _amount);
    }

    function claimRewards() public {
        uint256 rewards = calculateRewards(msg.sender) + rewardDebt[msg.sender];
        require(rewards > 0, "No rewards to claim");

        rewardDebt[msg.sender] = 0;
        lastUpdatedTime[msg.sender] = block.timestamp;
        token.transfer(msg.sender, rewards);

        emit RewardsClaimed(msg.sender, rewards);
    }
}
