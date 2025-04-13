// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TecFiAI is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 1_500_000 * 10**6; // 1.5M TECFI with 6 decimals

    // Predefined wallet allocations
    address public constant AIRDROP = 0x6843B7e61C88B0907A58d8886cCb21048C1d8a29;
    address public constant LIQUIDITY = 0x06CfeD651770a818F45BdC21f82c7c78b6DE3BD1;
    address public constant STAKING = 0x28fF3dFbFa27cCa78e72492f59E3DF8353Eef49C;
    address public constant DAO = 0xcbbe195Fc44B302Aa7DED74CA8376206bfD225a8;
    address public constant MARKETING = 0x74eA68A9b092B7777d5c8f26FB6136115CE7371c;
    address public constant CREATOR = 0x61cF3f2574bBDCbdF87f5DA4fcaF904763Ab9877;

    constructor() ERC20("TecFi AI", "TECFI") {
        _mint(AIRDROP, 225_000 * 10**6);
        _mint(LIQUIDITY, 225_000 * 10**6);
        _mint(STAKING, 450_000 * 10**6);
        _mint(DAO, 300_000 * 10**6);
        _mint(MARKETING, 225_000 * 10**6);
        _mint(CREATOR, 75_000 * 10**6);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
