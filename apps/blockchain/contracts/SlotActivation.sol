// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 */
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;
    constructor() { _status = _NOT_ENTERED; }
    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract SlotActivation is ReentrancyGuard {
    IERC20 public usdtToken;
    
    // Distribution addresses
    address public royaltyWallet;
    address public productWallet;
    address public devWallet;
    address public expenseWallet;
    address public developmentWallet;

    // Mapping to store referrer info for each user
    mapping(address => address) public referrer;
    // Mapping to check if a user has activated
    mapping(address => bool) public activated;

    event SlotActivated(address indexed user, address indexed referrer, uint256 amount);

    constructor(
        address _usdtAddress,
        address _royaltyWallet,
        address _productWallet,
        address _devWallet,
        address _expenseWallet,
        address _developmentWallet
    ) {
        usdtToken = IERC20(_usdtAddress);
        royaltyWallet = _royaltyWallet;
        productWallet = _productWallet;
        devWallet = _devWallet;
        expenseWallet = _expenseWallet;
        developmentWallet = _developmentWallet;
    }

    /**
     * @dev Activate a slot with USDT. 
     * @param _referrer The address of the referrer.
     * @param _amount The amount of USDT to pay (e.g. 20 * 10^6).
     */
    function activateSlot(address _referrer, uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than zero");
        require(_referrer != msg.sender, "Cannot refer yourself");
        
        // Transfer USDT from user to contract
        // User must approve this contract to spend USDT first
        require(usdtToken.transferFrom(msg.sender, address(this), _amount), "USDT transfer failed");

        // Mark as activated and set referrer if not already set
        if (!activated[msg.sender]) {
            activated[msg.sender] = true;
            referrer[msg.sender] = _referrer;
        }

        // Divide balance correctly (50% System, 50% Referral)
        uint256 systemAmount = _amount / 2;
        uint256 referralAmount = _amount - systemAmount; 

        distributeSystem(systemAmount);
        distributeReferral(msg.sender, referralAmount);

        emit SlotActivated(msg.sender, _referrer, _amount);
    }

    function distributeSystem(uint256 amount) internal {
        _send(royaltyWallet, (amount * 40) / 100);
        _send(productWallet, (amount * 20) / 100);
        _send(devWallet, (amount * 20) / 100);
        _send(expenseWallet, (amount * 10) / 100);
        _send(developmentWallet, (amount * 10) / 100);
    }

    function distributeReferral(address user, uint256 amount) internal {
        address l1 = referrer[user];
        address l2 = (l1 != address(0)) ? referrer[l1] : address(0);
        address l3 = (l2 != address(0)) ? referrer[l2] : address(0);
        address l4 = (l3 != address(0)) ? referrer[l3] : address(0);

        if (l1 != address(0)) _send(l1, (amount * 50) / 100);
        if (l2 != address(0)) _send(l2, (amount * 30) / 100);
        if (l3 != address(0)) _send(l3, (amount * 10) / 100);
        if (l4 != address(0)) _send(l4, (amount * 10) / 100);
    }

    function _send(address to, uint256 amount) internal {
        if (amount > 0 && to != address(0)) {
            usdtToken.transfer(to, amount);
        }
    }
}
