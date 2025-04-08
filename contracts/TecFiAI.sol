// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TecFiAI is ERC20, Ownable {

    uint8 private constant _DECIMALS = 6;

    // --- Allocation Wallets ---
    address public constant AIRDROP_WALLET      = 0x1958904FD332904B0865936A7fE7BE6DC49e452F;
    address public constant LIQUIDITY_WALLET    = 0x2e3023944d3de029a6069F20279Da0c601eb8cB2;
    address public constant STAKING_WALLET      = 0x8C1B917bB9d783302354F2e85F355324e37DB356;
    address public constant TREASURY_WALLET     = 0x3779bfa7B066f98050e585Aa7D4e0687e19107ca;
    address public constant DEV_WALLET          = 0x754F52fdd50A8f145bCd2B57af67A445D6D78F3f;

    constructor(address initialOwner) ERC20("TecFi AI", "TECFI") Ownable(initialOwner) {
        uint256 unit = 10 ** _DECIMALS;

        // --- Distribute Fixed Supply ---
        _mint(AIRDROP_WALLET,     150_000_000 * unit); // 7.5%
        _mint(LIQUIDITY_WALLET,   500_000_000 * unit); // 25%
        _mint(STAKING_WALLET,     800_000_000 * unit); // 40%
        _mint(TREASURY_WALLET,    450_000_000 * unit); // 22.5%
        _mint(DEV_WALLET,         100_000_000 * unit); // 5%
    }

    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }
}
