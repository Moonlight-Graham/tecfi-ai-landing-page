// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VDTOAirdropOpenClaim is Ownable {
    IERC20 public immutable vdto;

    uint256 public constant CLAIM_AMOUNT = 500 * 10**6; // 500 VDTO
    uint256 public constant PHASE1_CAP = 25_000_000 * 10**6;
    uint256 public constant PHASE2_CAP = 25_000_000 * 10**6;

    uint256 public phase1Claimed;
    uint256 public phase2Claimed;

    mapping(address => bool) public hasClaimedPhase1;
    mapping(address => bool) public hasClaimedPhase2;

    event AirdropClaimed(address indexed user, uint8 phase);

    constructor(IERC20 _vdto) Ownable(msg.sender) {
        vdto = _vdto;
    }

    function claimPhase1() external {
        require(!hasClaimedPhase1[msg.sender], "Already claimed Phase 1");
        require(phase1Claimed + CLAIM_AMOUNT <= PHASE1_CAP, "Phase 1 cap reached");

        hasClaimedPhase1[msg.sender] = true;
        phase1Claimed += CLAIM_AMOUNT;
        vdto.transfer(msg.sender, CLAIM_AMOUNT);

        emit AirdropClaimed(msg.sender, 1);
    }

    function claimPhase2() external {
        require(!hasClaimedPhase2[msg.sender], "Already claimed Phase 2");
        require(phase2Claimed + CLAIM_AMOUNT <= PHASE2_CAP, "Phase 2 cap reached");

        hasClaimedPhase2[msg.sender] = true;
        phase2Claimed += CLAIM_AMOUNT;
        vdto.transfer(msg.sender, CLAIM_AMOUNT);

        emit AirdropClaimed(msg.sender, 2);
    }

    function emergencyWithdraw(address to, uint256 amount) external onlyOwner {
        vdto.transfer(to, amount);
    }
}
