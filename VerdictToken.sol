// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VerdictToken is ERC20Permit, ERC20Votes, Ownable {
    uint8 public constant _decimals = 6;
    uint256 public constant _totalSupply = 500_000_000 * 10**_decimals;

    constructor() ERC20("Verdict Token", "VDTO") ERC20Permit("Verdict Token") {
        // Initial Allocations
        _mint(0x28fF3dFbFa27cCa78e72492f59E3DF8353Eef49C, 150_000_000 * 10**_decimals); // Staking & Rewards (30%)
        _mint(0x74eA68A9b092B7777d5c8f26FB6136115CE7371c, 100_000_000 * 10**_decimals); // Marketing & Listings (20%)
        _mint(0x6843B7e61C88B0907A58d8886cCb21048C1d8a29,  50_000_000 * 10**_decimals); // Airdrop (10%)
        _mint(0x06CfeD651770a818F45BdC21f82c7c78b6DE3BD1,  75_000_000 * 10**_decimals); // Liquidity Pool (15%)
        _mint(0xcbbe195Fc44B302Aa7DED74CA8376206bfD225a8, 100_000_000 * 10**_decimals); // DAO Treasury (20%)
        _mint(0x754F52fdd50A8f145bCd2B57af67A445D6D78F3f,  25_000_000 * 10**_decimals); // Creator Rewards (5%)
    }

    function decimals() public pure override returns (uint8) {
        return _decimals;
    }

    // Required overrides for ERC20Votes
    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}
