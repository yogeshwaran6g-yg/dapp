// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender,address recipient,uint256 amount) external returns (bool);
}

contract SlotActivation is ReentrancyGuard {

    using SafeERC20 for IERC20;

    IERC20 public usdt;

    uint256 public slotPrice = 20 * 1e6; // USDT (6 decimals)

    address public royaltyWallet;
    address public productWallet;
    address public devWallet;
    address public expenseWallet;
    address public developmentWallet;

    mapping(address => address) public referrer;
    mapping(address => bool) public activated;

    event SlotActivated(address user, address referrer, uint256 amount);

    constructor(
        address _usdt,
        address _royaltyWallet,
        address _productWallet,
        address _devWallet,
        address _expenseWallet,
        address _developmentWallet
    ) {
        usdt = IERC20(_usdt);

        royaltyWallet = _royaltyWallet;
        productWallet = _productWallet;
        devWallet = _devWallet;
        expenseWallet = _expenseWallet;
        developmentWallet = _developmentWallet;
    }

    function activateSlot(address _referrer) external nonReentrant {

        require(!activated[msg.sender], "Slot already activated");
        require(_referrer != msg.sender, "Invalid referrer");

        // Transfer USDT from user
        usdt.safeTransferFrom(msg.sender, address(this), slotPrice);

        activated[msg.sender] = true;
        referrer[msg.sender] = _referrer;

        uint256 systemAmount = slotPrice / 2;
        uint256 referralAmount = slotPrice / 2;

        distributeSystem(systemAmount);
        distributeReferral(msg.sender, referralAmount);

        emit SlotActivated(msg.sender, _referrer, slotPrice);
    }

    function distributeSystem(uint256 amount) internal {

        uint256 royalty = (amount * 40) / 100; // 4 USDT
        uint256 product = (amount * 20) / 100; // 2 USDT
        uint256 dev = (amount * 20) / 100; // 2 USDT
        uint256 expense = (amount * 10) / 100; // 1 USDT
        uint256 development = (amount * 10) / 100; // 1 USDT

        usdt.safeTransfer(royaltyWallet, royalty);
        usdt.safeTransfer(productWallet, product);
        usdt.safeTransfer(devWallet, dev);
        usdt.safeTransfer(expenseWallet, expense);
        usdt.safeTransfer(developmentWallet, development);
    }

    function distributeReferral(address user, uint256 amount) internal {

        address level1 = referrer[user];
        address level2 = referrer[level1];
        address level3 = referrer[level2];
        address level4 = referrer[level3];

        uint256 l1 = (amount * 50) / 100; // 5 USDT
        uint256 l2 = (amount * 30) / 100; // 3 USDT
        uint256 l3 = (amount * 10) / 100; // 1 USDT
        uint256 l4 = (amount * 10) / 100; // 1 USDT

        if(level1 != address(0)) usdt.safeTransfer(level1, l1);
        if(level2 != address(0)) usdt.safeTransfer(level2, l2);
        if(level3 != address(0)) usdt.safeTransfer(level3, l3);
        if(level4 != address(0)) usdt.safeTransfer(level4, l4);
    }
}