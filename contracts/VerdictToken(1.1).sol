// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VerdictToken
 * @dev ERC20 Token with Permit and Ownable access control. No burn function.
 */
contract VerdictToken is ERC20, ERC20Permit, Ownable {
    uint8 public constant _decimals = 6;
    uint256 public constant totalSupplyFixed = 500_000_000 * 10**_decimals;

    constructor()
        ERC20("Verdict Token", "VDTO")
        ERC20Permit("Verdict Token")
        Ownable(msg.sender)
    {
        // Initial Allocations
        _mint(0x28fF3dFbFa27cCa78e72492f59E3DF8353Eef49C, 150_000_000 * 10**_decimals);
        _mint(0x74eA68A9b092B7777d5c8f26FB6136115CE7371c, 100_000_000 * 10**_decimals);
        _mint(0x6843B7e61C88B0907A58d8886cCb21048C1d8a29,  50_000_000 * 10**_decimals);
        _mint(0x06CfeD651770a818F45BdC21f82c7c78b6DE3BD1,  75_000_000 * 10**_decimals);
        _mint(0xcbbe195Fc44B302Aa7DED74CA8376206bfD225a8, 100_000_000 * 10**_decimals);
        _mint(0x754F52fdd50A8f145bCd2B57af67A445D6D78F3f,  25_000_000 * 10**_decimals);
    }

    function decimals() public pure override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Optional mint function restricted to the owner.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
