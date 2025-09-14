// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Basic pension contract - simplified for testing (FHE concepts in comments)
contract SecurePensionPlatform {
    
    struct PensionAccount {
        uint64 balance; // Balance (would be encrypted with FHE)
        uint64 contributions; // Total contributions (would be encrypted with FHE) 
        uint64 investmentReturns; // Investment returns (would be encrypted with FHE)
        uint256 lastContribution; // Timestamp of last contribution
        uint256 retirementAge; // Retirement age set by user
        bool isActive; // Account status
        bool isRetired; // Retirement status
    }
    
    struct InvestmentOption {
        string name;
        uint256 riskLevel; // 1-10, 10 being highest risk
        uint64 currentReturn; // Current return rate (would be encrypted with FHE)
        bool isActive;
    }
    
    mapping(address => PensionAccount) public pensionAccounts;
    mapping(uint256 => InvestmentOption) public investmentOptions;
    mapping(address => uint256) public userInvestmentChoice;
    
    uint256 public totalInvestmentOptions;
    uint256 public constant MIN_RETIREMENT_AGE = 55;
    uint256 public constant MAX_RETIREMENT_AGE = 75;
    address public admin;
    
    event AccountCreated(address indexed user, uint256 retirementAge);
    event ContributionMade(address indexed user, bytes encryptedAmount);
    event InvestmentOptionSelected(address indexed user, uint256 optionId);
    event RetirementInitiated(address indexed user);
    event WithdrawalMade(address indexed user, bytes encryptedAmount);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    modifier hasActiveAccount() {
        require(pensionAccounts[msg.sender].isActive, "No active pension account");
        _;
    }
    
    modifier notRetired() {
        require(!pensionAccounts[msg.sender].isRetired, "Account is already retired");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        
        // Initialize default investment options
        investmentOptions[0] = InvestmentOption({
            name: "Conservative Bonds",
            riskLevel: 2,
            currentReturn: 300, // 3% (would be encrypted with FHE)
            isActive: true
        });
        
        investmentOptions[1] = InvestmentOption({
            name: "Balanced Portfolio",
            riskLevel: 5,
            currentReturn: 600, // 6% (would be encrypted with FHE)
            isActive: true
        });
        
        investmentOptions[2] = InvestmentOption({
            name: "Growth Stocks",
            riskLevel: 8,
            currentReturn: 900, // 9% (would be encrypted with FHE)
            isActive: true
        });
        
        totalInvestmentOptions = 3;
    }
    
    function createPensionAccount(uint256 _retirementAge) external {
        require(!pensionAccounts[msg.sender].isActive, "Account already exists");
        require(_retirementAge >= MIN_RETIREMENT_AGE && _retirementAge <= MAX_RETIREMENT_AGE, "Invalid retirement age");
        
        pensionAccounts[msg.sender] = PensionAccount({
            balance: 0, // Would be encrypted with FHE
            contributions: 0, // Would be encrypted with FHE
            investmentReturns: 0, // Would be encrypted with FHE
            lastContribution: block.timestamp,
            retirementAge: _retirementAge,
            isActive: true,
            isRetired: false
        });
        
        // Default to conservative investment
        userInvestmentChoice[msg.sender] = 0;
        
        emit AccountCreated(msg.sender, _retirementAge);
    }
    
    function makeContribution(uint64 amount) external payable hasActiveAccount notRetired {
        // Add to balance and contributions (FHE encryption would happen here)
        pensionAccounts[msg.sender].balance += amount;
        pensionAccounts[msg.sender].contributions += amount;
        pensionAccounts[msg.sender].lastContribution = block.timestamp;
        
        emit ContributionMade(msg.sender, abi.encodePacked(amount));
    }
    
    function selectInvestmentOption(uint256 optionId) external hasActiveAccount notRetired {
        require(optionId < totalInvestmentOptions, "Invalid investment option");
        require(investmentOptions[optionId].isActive, "Investment option not active");
        
        userInvestmentChoice[msg.sender] = optionId;
        
        emit InvestmentOptionSelected(msg.sender, optionId);
    }
    
    function calculateReturns() external hasActiveAccount {
        PensionAccount storage account = pensionAccounts[msg.sender];
        uint256 investmentOption = userInvestmentChoice[msg.sender];
        
        // Calculate time-based returns (simplified, would use FHE in production)
        uint256 timeElapsed = block.timestamp - account.lastContribution;
        if (timeElapsed > 30 days) {
            uint64 returnRate = investmentOptions[investmentOption].currentReturn;
            uint64 monthlyReturn = (account.balance * returnRate) / 10000; // Divide by 100 for percentage, then 100 for monthly
            
            account.investmentReturns += monthlyReturn;
            account.balance += monthlyReturn;
        }
    }
    
    function initiateRetirement() external hasActiveAccount notRetired {
        // In a real system, you'd verify age through oracle or other means
        pensionAccounts[msg.sender].isRetired = true;
        
        emit RetirementInitiated(msg.sender);
    }
    
    function withdraw(uint64 amount) external payable hasActiveAccount {
        require(pensionAccounts[msg.sender].isRetired, "Must be retired to withdraw");
        
        uint64 currentBalance = pensionAccounts[msg.sender].balance;
        
        // Check if withdrawal amount is valid (would use encrypted comparison in FHE)
        require(amount <= currentBalance, "Insufficient balance");
        
        // Update balance
        pensionAccounts[msg.sender].balance -= amount;
        
        emit WithdrawalMade(msg.sender, abi.encodePacked(amount));
    }
    
    // In production, these would return encrypted values using FHE
    function getBalance() external view hasActiveAccount returns (uint64) {
        return pensionAccounts[msg.sender].balance;
    }
    
    function getContributions() external view hasActiveAccount returns (uint64) {
        return pensionAccounts[msg.sender].contributions;
    }
    
    function getReturns() external view hasActiveAccount returns (uint64) {
        return pensionAccounts[msg.sender].investmentReturns;
    }
    
    function getAccountInfo() external view hasActiveAccount returns (
        uint256 retirementAge,
        uint256 lastContribution,
        bool isRetired,
        uint256 selectedInvestment
    ) {
        PensionAccount memory account = pensionAccounts[msg.sender];
        return (
            account.retirementAge,
            account.lastContribution,
            account.isRetired,
            userInvestmentChoice[msg.sender]
        );
    }
    
    function getInvestmentOption(uint256 optionId) external view returns (
        string memory name,
        uint256 riskLevel,
        bool isActive
    ) {
        require(optionId < totalInvestmentOptions, "Invalid investment option");
        InvestmentOption memory option = investmentOptions[optionId];
        return (option.name, option.riskLevel, option.isActive);
    }
    
    // Admin functions
    function addInvestmentOption(
        string memory name,
        uint256 riskLevel,
        uint64 returnRate
    ) external onlyAdmin {
        investmentOptions[totalInvestmentOptions] = InvestmentOption({
            name: name,
            riskLevel: riskLevel,
            currentReturn: returnRate,
            isActive: true
        });
        totalInvestmentOptions++;
    }
    
    function updateInvestmentReturn(uint256 optionId, uint64 returnRate) external onlyAdmin {
        require(optionId < totalInvestmentOptions, "Invalid investment option");
        investmentOptions[optionId].currentReturn = returnRate;
    }
    
    function toggleInvestmentOption(uint256 optionId) external onlyAdmin {
        require(optionId < totalInvestmentOptions, "Invalid investment option");
        investmentOptions[optionId].isActive = !investmentOptions[optionId].isActive;
    }
}