// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "./Token.sol";

contract Staking {
    MuriaticToken public token;
    uint256 public rewardRate = 100;

    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public rewardDebt;
    mapping(address => uint256) public lastUpdatedBlock;

    event Staked(address indexed user, uint256 amount);
    event UnStaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(MuriaticToken _token) {
        token = _token;
    }
    function calculateRewards(address _user) internal view returns (uint256) {
        return (stakedAmount[_user] * rewardRate * (block.number - lastUpdatedBlock[_user]));
    }

    function stake(uint256 _amount) public {
        require(_amount > 0, "Cannot stake 0");
        if (stakedAmount[msg.sender] > 0) {
            uint256 pendingRewards = calculateRewards(msg.sender);
            rewardDebt[msg.sender] += pendingRewards;
        }

        token.transferFrom(msg.sender, address(this), _amount);
        lastUpdatedBlock[msg.sender] = block.number;

        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) public {
        require (stakedAmount[msg.sender] >= _amount, "Insufficient staked amount");
        
        uint256 pendingRewards = calculateRewards(msg.sender);
        rewardDebt[msg.sender] += pendingRewards;

        stakedAmount[msg.sender] -= _amount;    
        lastUpdatedBlock[msg.sender] = block.number;

        token.transfer(msg.sender, _amount);
        emit UnStaked(msg.sender, _amount);
    }

    function claimRewards() public {
        uint256 rewards = calculateRewards(msg.sender) + rewardDebt[msg.sender];
        require(rewards > 0, "No rewards to claim");

        rewardDebt[msg.sender] = 0;
        lastUpdatedBlock[msg.sender] = block.number;
        token.transfer(msg.sender, rewards);

        emit RewardsClaimed(msg.sender, rewards); 

    }

    


}


