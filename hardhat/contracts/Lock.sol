// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface ILock {
    event LockSet(uint256 unlockTime, uint256 amount);
    event Withdrawal(uint256 amount, uint256 when);
}

contract Lock is ILock {
    uint public unlockTime;
    address payable public owner;
    bool public locked;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier notLocked() {
        require(!locked, "Funds are locked");
        _;
    }

    modifier isLocked() {
        require(locked, "Funds are not locked");
        _;
    }

    modifier isUnlockTimePassed() {
        require(block.timestamp >= unlockTime, "Unlock time not passed yet");
        _;
    }

    modifier nonReentrant() {
        bool _locked = locked;
        require(!_locked, "Reentrancy detected");
        locked = true;
        _;
        locked = _locked;
    }

    constructor(uint _unlockTime) payable {
        require(block.timestamp < _unlockTime, "Unlock time should be in the future");
        unlockTime = _unlockTime;
        owner = payable(msg.sender);
        emit LockSet(unlockTime, address(this).balance);
    }

    function withdraw() public onlyOwner isUnlockTimePassed nonReentrant {
        uint amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");

        emit Withdrawal(amount, block.timestamp);
        owner.transfer(amount);
    }

    // Function to allow owner to extend the unlock time if desired
    function extendUnlockTime(uint newUnlockTime) public onlyOwner {
        require(newUnlockTime > block.timestamp, "New unlock time should be in the future");
        require(newUnlockTime > unlockTime, "New unlock time should be later than the current one");
        unlockTime = newUnlockTime;
    }

    // Function to check the contract's balance
    function contractBalance() public view returns (uint) {
        return address(this).balance;
    }
}
