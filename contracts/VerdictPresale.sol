// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VDTOPresale is Ownable {
    IERC20 public immutable vdto;
    uint256 public immutable startTime;
    uint256 public constant PRESALE_CAP = 50_000_000 * 10**6;

    uint256 public constant MIN_BUY = 0.05 ether;
    uint256 public constant MAX_BUY = 25 ether;

    uint256 public totalSold;
    mapping(address => uint256) public contributions;

    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 vdtoAmount);

    constructor(IERC20 _vdto, uint256 _startTime) Ownable(msg.sender) {
        vdto = _vdto;
        startTime = _startTime;
    }

    receive() external payable {
        buyTokens();
    }

    function buyTokens() public payable {
        require(block.timestamp >= startTime, "Presale not started yet");
        require(msg.value >= MIN_BUY, "Min contribution is 0.05 ETH");
        require(contributions[msg.sender] + msg.value <= MAX_BUY, "Exceeds max per wallet");

        uint256 rate = getCurrentRate();
        require(rate > 0, "Presale ended");

        uint256 vdtoAmount = msg.value * rate;
        require(totalSold + vdtoAmount <= PRESALE_CAP, "Presale cap exceeded");

        totalSold += vdtoAmount;
        contributions[msg.sender] += msg.value;

        vdto.transfer(msg.sender, vdtoAmount);

        emit TokensPurchased(msg.sender, msg.value, vdtoAmount);
    }

    function getCurrentRate() public view returns (uint256) {
        if (block.timestamp < startTime) return 0;

        uint256 week = (block.timestamp - startTime) / 1 weeks;

        if (week == 0) return 150_000;
        if (week == 1) return 140_000;
        if (week == 2) return 130_000;
        if (week == 3) return 120_000;
        if (week == 4) return 110_000;

        return 0; // Presale closed
    }

    function withdrawETH(address to) external onlyOwner {
        payable(to).transfer(address(this).balance);
    }

    function withdrawUnsoldTokens(address to) external onlyOwner {
        uint256 unsold = vdto.balanceOf(address(this));
        vdto.transfer(to, unsold);
    }
}
