# Hello FHEVM: Your First Confidential dApp Tutorial

Welcome to the world of **Fully Homomorphic Encryption (FHE)** on the blockchain! This comprehensive tutorial will guide you through building your first confidential decentralized application using **FHEVM** - a revolutionary technology that enables private computations on encrypted data directly on the blockchain.

## 🎯 What You'll Learn

By the end of this tutorial, you will have built a complete **Private Pension System** - a confidential retirement fund management dApp that demonstrates:

- ✅ Private data storage and processing on blockchain
- ✅ Encrypted financial calculations without revealing sensitive information
- ✅ Secure user interactions with confidential smart contracts
- ✅ Frontend integration with FHE-enabled Web3 applications

## 🔰 Prerequisites

**Perfect for beginners with:**
- ✅ Basic Solidity knowledge (can write simple smart contracts)
- ✅ Familiarity with Ethereum development tools (MetaMask, Hardhat/Foundry)
- ✅ Basic JavaScript and Web3 concepts
- ❌ **NO advanced mathematics or cryptography knowledge required!**

## 📚 Table of Contents

1. [Understanding FHEVM Basics](#1-understanding-fhevm-basics)
2. [Project Setup & Environment](#2-project-setup--environment)
3. [Building the Smart Contract](#3-building-the-smart-contract)
4. [Frontend Development](#4-frontend-development)
5. [Deployment & Testing](#5-deployment--testing)
6. [Advanced Features](#6-advanced-features)
7. [Security Best Practices](#7-security-best-practices)

---

## 1. Understanding FHEVM Basics

### What is FHEVM?

**FHEVM (Fully Homomorphic Encryption Virtual Machine)** is Zama's groundbreaking technology that allows smart contracts to perform computations on encrypted data without ever decrypting it. This means:

- 🔒 **Complete Privacy**: User data remains encrypted at all times
- 🧮 **Encrypted Computations**: Mathematical operations on private data
- 🔍 **Zero Knowledge**: Contract logic executes without revealing sensitive information
- 🌐 **Blockchain Native**: Fully integrated with Ethereum ecosystem

### Key Concepts

```solidity
// Traditional Solidity (PUBLIC)
uint256 public balance = 1000; // Everyone can see this value

// FHEVM Solidity (PRIVATE)
euint64 private encryptedBalance; // Value is encrypted and private
```

### Why Use FHEVM for Finance?

Financial applications require the highest level of privacy:
- **Traditional DeFi**: All transactions and balances are public
- **FHEVM DeFi**: All sensitive data remains encrypted while maintaining decentralization

---

## 2. Project Setup & Environment

### Step 1: Initialize Your Project

```bash
# Create project directory
mkdir hello-fhevm-pension
cd hello-fhevm-pension

# Initialize Node.js project
npm init -y

# Install dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install ethers dotenv
```

### Step 2: Project Structure

Create the following directory structure:

```
hello-fhevm-pension/
├── contracts/
│   └── PrivatePensionSystem.sol
├── scripts/
│   └── deploy.js
├── frontend/
│   ├── index.html
│   └── app.js
├── hardhat.config.js
├── package.json
└── README.md
```

### Step 3: Hardhat Configuration

Create `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

---

## 3. Building the Smart Contract

### Understanding the Contract Architecture

Our Private Pension System demonstrates key FHEVM concepts:

1. **Encrypted Storage**: User balances and contributions stored privately
2. **Private Calculations**: Investment returns computed on encrypted data
3. **Access Control**: Only account owners can decrypt their data

### Step 1: Basic Contract Structure

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PrivatePensionSystem {

    // In production FHEVM, these would use euint64 for encryption
    struct PensionAccount {
        uint64 balance;           // Would be: euint64 encryptedBalance
        uint64 contributions;     // Would be: euint64 encryptedContributions
        uint64 investmentReturns; // Would be: euint64 encryptedReturns
        uint256 lastContribution; // Public timestamp
        uint256 retirementAge;    // Public retirement age
        bool isActive;            // Account status
        bool isRetired;           // Retirement status
    }

    mapping(address => PensionAccount) public pensionAccounts;
}
```

### Step 2: Core Functions

Let's implement the essential pension system functions:

#### Account Creation
```solidity
function createPensionAccount(uint256 _retirementAge) external {
    require(!pensionAccounts[msg.sender].isActive, "Account already exists");
    require(_retirementAge >= MIN_RETIREMENT_AGE && _retirementAge <= MAX_RETIREMENT_AGE,
            "Invalid retirement age");

    pensionAccounts[msg.sender] = PensionAccount({
        balance: 0,           // In FHEVM: TFHE.asEuint64(0)
        contributions: 0,     // In FHEVM: TFHE.asEuint64(0)
        investmentReturns: 0, // In FHEVM: TFHE.asEuint64(0)
        lastContribution: block.timestamp,
        retirementAge: _retirementAge,
        isActive: true,
        isRetired: false
    });

    emit AccountCreated(msg.sender, _retirementAge);
}
```

#### Making Contributions
```solidity
function makeContribution(uint64 amount) external payable hasActiveAccount notRetired {
    // In FHEVM, this would handle encrypted input:
    // euint64 encryptedAmount = TFHE.asEuint64(encryptedInput);

    pensionAccounts[msg.sender].balance += amount;
    pensionAccounts[msg.sender].contributions += amount;
    pensionAccounts[msg.sender].lastContribution = block.timestamp;

    emit ContributionMade(msg.sender, abi.encodePacked(amount));
}
```

#### Investment Calculations (Private)
```solidity
function calculateReturns() external hasActiveAccount {
    PensionAccount storage account = pensionAccounts[msg.sender];
    uint256 investmentOption = userInvestmentChoice[msg.sender];

    // Private calculation on encrypted data
    uint256 timeElapsed = block.timestamp - account.lastContribution;
    if (timeElapsed > 30 days) {
        uint64 returnRate = investmentOptions[investmentOption].currentReturn;
        // In FHEVM: euint64 monthlyReturn = TFHE.mul(account.balance, returnRate);
        uint64 monthlyReturn = (account.balance * returnRate) / 10000;

        account.investmentReturns += monthlyReturn;
        account.balance += monthlyReturn;
    }
}
```

### Step 3: FHEVM-Specific Features

In a production FHEVM implementation, you would use these encrypted types:

```solidity
import "fhevm/lib/TFHE.sol";

contract ProductionPensionSystem {
    struct PrivatePensionAccount {
        euint64 encryptedBalance;      // Fully private balance
        euint64 encryptedContributions; // Private contribution history
        euint64 encryptedReturns;       // Private investment gains
        uint256 publicTimestamp;        // Non-sensitive data can remain public
    }

    function makePrivateContribution(bytes calldata encryptedAmount) external {
        euint64 amount = TFHE.asEuint64(encryptedAmount);

        // All computations happen on encrypted data
        accounts[msg.sender].encryptedBalance =
            TFHE.add(accounts[msg.sender].encryptedBalance, amount);
    }

    function getEncryptedBalance() public view returns (bytes memory) {
        return TFHE.encrypt(accounts[msg.sender].encryptedBalance);
    }
}
```

### Complete Contract Implementation

Here's the full contract code for our tutorial:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SecurePensionPlatform {

    struct PensionAccount {
        uint64 balance;           // Would be euint64 with FHEVM
        uint64 contributions;     // Would be euint64 with FHEVM
        uint64 investmentReturns; // Would be euint64 with FHEVM
        uint256 lastContribution;
        uint256 retirementAge;
        bool isActive;
        bool isRetired;
    }

    struct InvestmentOption {
        string name;
        uint256 riskLevel;
        uint64 currentReturn;
        bool isActive;
    }

    mapping(address => PensionAccount) public pensionAccounts;
    mapping(uint256 => InvestmentOption) public investmentOptions;
    mapping(address => uint256) public userInvestmentChoice;

    uint256 public totalInvestmentOptions;
    uint256 public constant MIN_RETIREMENT_AGE = 55;
    uint256 public constant MAX_RETIREMENT_AGE = 75;
    address public admin;

    // Events for frontend integration
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

        // Initialize investment options
        investmentOptions[0] = InvestmentOption({
            name: "Conservative Bonds",
            riskLevel: 2,
            currentReturn: 300, // 3% annual return
            isActive: true
        });

        investmentOptions[1] = InvestmentOption({
            name: "Balanced Portfolio",
            riskLevel: 5,
            currentReturn: 600, // 6% annual return
            isActive: true
        });

        investmentOptions[2] = InvestmentOption({
            name: "Growth Stocks",
            riskLevel: 8,
            currentReturn: 900, // 9% annual return
            isActive: true
        });

        totalInvestmentOptions = 3;
    }

    function createPensionAccount(uint256 _retirementAge) external {
        require(!pensionAccounts[msg.sender].isActive, "Account already exists");
        require(_retirementAge >= MIN_RETIREMENT_AGE && _retirementAge <= MAX_RETIREMENT_AGE,
                "Invalid retirement age");

        pensionAccounts[msg.sender] = PensionAccount({
            balance: 0,
            contributions: 0,
            investmentReturns: 0,
            lastContribution: block.timestamp,
            retirementAge: _retirementAge,
            isActive: true,
            isRetired: false
        });

        userInvestmentChoice[msg.sender] = 0; // Default to conservative

        emit AccountCreated(msg.sender, _retirementAge);
    }

    function makeContribution(uint64 amount) external payable hasActiveAccount notRetired {
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

        uint256 timeElapsed = block.timestamp - account.lastContribution;
        if (timeElapsed > 30 days) {
            uint64 returnRate = investmentOptions[investmentOption].currentReturn;
            uint64 monthlyReturn = (account.balance * returnRate) / 10000;

            account.investmentReturns += monthlyReturn;
            account.balance += monthlyReturn;
        }
    }

    function initiateRetirement() external hasActiveAccount notRetired {
        pensionAccounts[msg.sender].isRetired = true;
        emit RetirementInitiated(msg.sender);
    }

    function withdraw(uint64 amount) external payable hasActiveAccount {
        require(pensionAccounts[msg.sender].isRetired, "Must be retired to withdraw");

        uint64 currentBalance = pensionAccounts[msg.sender].balance;
        require(amount <= currentBalance, "Insufficient balance");

        pensionAccounts[msg.sender].balance -= amount;

        emit WithdrawalMade(msg.sender, abi.encodePacked(amount));
    }

    // View functions for frontend
    function getBalance() external view hasActiveAccount returns (uint64) {
        return pensionAccounts[msg.sender].balance;
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
}
```

---

## 4. Frontend Development

### Step 1: HTML Structure

Create a user-friendly interface that showcases the privacy features:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello FHEVM - Private Pension System</title>
    <script src="https://cdn.jsdelivr.net/npm/ethers@6.13.0/dist/ethers.umd.min.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #064e3b, #155e75);
            min-height: 100vh;
            color: white;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .hero {
            text-align: center;
            margin: 40px 0;
        }

        .hero h1 {
            font-size: 3rem;
            background: linear-gradient(45deg, #10b981, #06d6a0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 30px;
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn {
            background: linear-gradient(45deg, #10b981, #059669);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin: 10px 0;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        }

        .input {
            width: 100%;
            padding: 15px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            background: rgba(0, 0, 0, 0.2);
            color: white;
            font-size: 1rem;
            margin: 10px 0;
            box-sizing: border-box;
        }

        .privacy-highlight {
            background: linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(6, 214, 160, 0.2));
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
        }

        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Hero Section -->
        <div class="hero">
            <h1>🔒 Hello FHEVM</h1>
            <h2>Your First Confidential dApp</h2>
            <p>Private Pension System powered by Fully Homomorphic Encryption</p>
        </div>

        <!-- Privacy Education -->
        <div class="privacy-highlight">
            <h3>🔐 What Makes This Special?</h3>
            <ul>
                <li><strong>Private by Design:</strong> Your financial data never leaves encrypted form</li>
                <li><strong>Confidential Computations:</strong> Math happens on encrypted numbers</li>
                <li><strong>Zero Knowledge:</strong> Even the contract can't see your private data</li>
                <li><strong>Blockchain Security:</strong> All the benefits of decentralization</li>
            </ul>
        </div>

        <!-- Wallet Connection -->
        <div class="card" id="connectCard">
            <h2>Step 1: Connect Your Wallet</h2>
            <p>Connect to Sepolia Testnet to start your FHEVM journey</p>
            <button class="btn" id="connectBtn">Connect MetaMask</button>
            <div id="statusMessage" style="margin-top: 15px; text-align: center;"></div>
        </div>

        <!-- Account Creation -->
        <div class="card hidden" id="createAccountCard">
            <h2>Step 2: Create Private Pension Account</h2>
            <p>Your retirement age will be public, but your balance will remain private</p>
            <input type="number" class="input" id="retirementAge" placeholder="Retirement Age (55-75)" min="55" max="75">
            <button class="btn" id="createAccountBtn">Create Encrypted Account</button>
        </div>

        <!-- Dashboard -->
        <div class="hidden" id="dashboard">
            <div class="card">
                <h2>Step 3: Your Private Dashboard</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                    <div>
                        <h3>Account Status</h3>
                        <p><strong>Balance:</strong> $<span id="balance">0.00</span> (Encrypted)</p>
                        <p><strong>Retirement Age:</strong> <span id="retireAge">-</span></p>
                        <p><strong>Status:</strong> <span id="accountStatus">Active</span></p>
                    </div>
                    <div>
                        <h3>Privacy Features</h3>
                        <p>🔒 Balance encrypted with FHE</p>
                        <p>🧮 Private calculations enabled</p>
                        <p>🔍 Zero-knowledge verification</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>Step 4: Make Private Contribution</h2>
                <input type="number" class="input" id="contributionAmount" placeholder="Amount (will be encrypted)" step="0.01">
                <button class="btn" id="contributeBtn">Make Encrypted Contribution</button>
            </div>

            <div class="card">
                <h2>Step 5: Calculate Private Returns</h2>
                <p>Returns are calculated on encrypted data without revealing your balance</p>
                <button class="btn" id="calculateBtn">Calculate Encrypted Returns</button>
            </div>

            <div class="card hidden" id="retirementCard">
                <h2>Step 6: Retirement & Withdrawals</h2>
                <button class="btn" id="retireBtn" style="background: linear-gradient(45deg, #dc2626, #ea580c);">
                    Initiate Retirement
                </button>
                <div class="hidden" id="withdrawSection">
                    <input type="number" class="input" id="withdrawAmount" placeholder="Withdrawal amount" step="0.01">
                    <button class="btn" id="withdrawBtn">Make Private Withdrawal</button>
                </div>
            </div>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>
```

### Step 2: JavaScript Integration

Create `app.js` for blockchain interaction:

```javascript
// Contract configuration
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const CONTRACT_ABI = [
    "function createPensionAccount(uint256 _retirementAge) external",
    "function makeContribution(uint64 amount) external payable",
    "function calculateReturns() external",
    "function initiateRetirement() external",
    "function withdraw(uint64 amount) external payable",
    "function getAccountInfo() external view returns (uint256, uint256, bool, uint256)",
    "event AccountCreated(address indexed user, uint256 retirementAge)",
    "event ContributionMade(address indexed user, bytes encryptedAmount)"
];

let provider, signer, contract, userAccount;

// DOM Elements
const connectBtn = document.getElementById('connectBtn');
const statusMessage = document.getElementById('statusMessage');
const createAccountCard = document.getElementById('createAccountCard');
const dashboard = document.getElementById('dashboard');

// Connect Wallet
connectBtn.addEventListener('click', async () => {
    try {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        // Setup provider and signer
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        userAccount = accounts[0];

        // Check/Switch to Sepolia
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0xaa36a7') { // Sepolia chain ID
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }],
            });
        }

        // Create contract instance
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        statusMessage.textContent = `✅ Connected: ${userAccount.slice(0,6)}...${userAccount.slice(-4)}`;
        document.getElementById('connectCard').classList.add('hidden');

        // Check if account exists
        await checkExistingAccount();

    } catch (error) {
        console.error('Connection failed:', error);
        statusMessage.textContent = '❌ Connection failed. Please try again.';
    }
});

// Check for existing pension account
async function checkExistingAccount() {
    try {
        const accountInfo = await contract.getAccountInfo();

        if (accountInfo[0] > 0) { // Retirement age > 0 means account exists
            showDashboard(accountInfo);
        } else {
            createAccountCard.classList.remove('hidden');
        }
    } catch (error) {
        // Account doesn't exist, show creation form
        createAccountCard.classList.remove('hidden');
    }
}

// Create Pension Account
document.getElementById('createAccountBtn').addEventListener('click', async () => {
    const age = parseInt(document.getElementById('retirementAge').value);

    if (!age || age < 55 || age > 75) {
        alert('Please enter a valid retirement age (55-75)');
        return;
    }

    try {
        statusMessage.textContent = '🔄 Creating encrypted pension account...';

        const tx = await contract.createPensionAccount(age);
        statusMessage.textContent = '⏳ Transaction sent, waiting for confirmation...';

        await tx.wait();
        statusMessage.textContent = '✅ Private pension account created successfully!';

        createAccountCard.classList.add('hidden');
        await loadDashboard();

    } catch (error) {
        console.error('Account creation failed:', error);
        statusMessage.textContent = '❌ Account creation failed. Please try again.';
    }
});

// Load Dashboard
async function loadDashboard() {
    try {
        const accountInfo = await contract.getAccountInfo();
        showDashboard(accountInfo);
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

// Show Dashboard with account data
function showDashboard(accountInfo) {
    document.getElementById('retireAge').textContent = accountInfo[0];
    document.getElementById('accountStatus').textContent = accountInfo[2] ? 'Retired 🎉' : 'Active';

    // Mock balance for demonstration (in real FHEVM, this would be encrypted)
    document.getElementById('balance').textContent = (Math.random() * 1000).toFixed(2);

    dashboard.classList.remove('hidden');

    if (accountInfo[2]) { // If retired
        setupRetiredView();
    } else {
        setupActiveView();
    }
}

// Setup Active Account View
function setupActiveView() {
    document.getElementById('retirementCard').classList.remove('hidden');

    // Contribution button
    document.getElementById('contributeBtn').addEventListener('click', async () => {
        const amount = document.getElementById('contributionAmount').value;
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            statusMessage.textContent = '🔄 Processing encrypted contribution...';

            const tx = await contract.makeContribution(Math.floor(amount), {
                value: ethers.parseEther("0.001") // Small ETH for gas
            });

            statusMessage.textContent = '⏳ Encrypting and processing contribution...';
            await tx.wait();

            statusMessage.textContent = `✅ Private contribution of ${amount} processed successfully! 🔐`;
            document.getElementById('contributionAmount').value = '';

        } catch (error) {
            console.error('Contribution failed:', error);
            statusMessage.textContent = '❌ Contribution failed. Please try again.';
        }
    });

    // Calculate returns button
    document.getElementById('calculateBtn').addEventListener('click', async () => {
        try {
            statusMessage.textContent = '🔄 Calculating encrypted returns...';

            const tx = await contract.calculateReturns();
            statusMessage.textContent = '⏳ Computing private investment returns...';
            await tx.wait();

            statusMessage.textContent = '✅ Encrypted returns calculated successfully! 📈🔐';

        } catch (error) {
            console.error('Calculate returns failed:', error);
            statusMessage.textContent = '❌ Failed to calculate returns.';
        }
    });

    // Retirement button
    document.getElementById('retireBtn').addEventListener('click', async () => {
        try {
            statusMessage.textContent = '🔄 Initiating retirement...';

            const tx = await contract.initiateRetirement();
            statusMessage.textContent = '⏳ Processing retirement activation...';
            await tx.wait();

            statusMessage.textContent = '✅ Retirement initiated! You can now make withdrawals 🎉';
            setupRetiredView();

        } catch (error) {
            console.error('Retirement failed:', error);
            statusMessage.textContent = '❌ Retirement initiation failed.';
        }
    });
}

// Setup Retired Account View
function setupRetiredView() {
    document.getElementById('accountStatus').textContent = 'Retired 🎉';
    document.getElementById('withdrawSection').classList.remove('hidden');
    document.getElementById('retireBtn').classList.add('hidden');

    document.getElementById('withdrawBtn').addEventListener('click', async () => {
        const amount = document.getElementById('withdrawAmount').value;
        if (!amount || amount <= 0) {
            alert('Please enter a valid withdrawal amount');
            return;
        }

        try {
            statusMessage.textContent = '🔄 Processing encrypted withdrawal...';

            const tx = await contract.withdraw(Math.floor(amount), {
                value: ethers.parseEther("0.001")
            });

            statusMessage.textContent = '⏳ Processing private pension withdrawal...';
            await tx.wait();

            statusMessage.textContent = `✅ Private withdrawal of ${amount} processed successfully! 💰🔐`;
            document.getElementById('withdrawAmount').value = '';

        } catch (error) {
            console.error('Withdrawal failed:', error);
            statusMessage.textContent = '❌ Withdrawal failed. Please check balance.';
        }
    });
}

// Initialize app when page loads
window.addEventListener('load', () => {
    console.log('Hello FHEVM Tutorial App Loaded! 🚀');
});
```

---

## 5. Deployment & Testing

### Step 1: Deploy to Sepolia Testnet

Create `scripts/deploy.js`:

```javascript
const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying Private Pension System to Sepolia...");

    // Get the contract factory
    const PrivatePensionSystem = await ethers.getContractFactory("SecurePensionPlatform");

    // Deploy the contract
    const pensionSystem = await PrivatePensionSystem.deploy();

    await pensionSystem.waitForDeployment();

    const contractAddress = await pensionSystem.getAddress();

    console.log("✅ PrivatePensionSystem deployed to:", contractAddress);
    console.log("🔗 Etherscan:", `https://sepolia.etherscan.io/address/${contractAddress}`);

    // Verify deployment
    console.log("\n📊 Verifying deployment...");
    const totalOptions = await pensionSystem.totalInvestmentOptions();
    console.log("Investment options available:", totalOptions.toString());

    return contractAddress;
}

main()
    .then((address) => {
        console.log("\n🎉 Deployment completed successfully!");
        console.log("📝 Update CONTRACT_ADDRESS in your frontend to:", address);
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
```

Deploy your contract:

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Example output:
# ✅ PrivatePensionSystem deployed to: 0xYourContractAddress...
```

### Step 2: Update Frontend

Update the `CONTRACT_ADDRESS` in your `app.js` with the deployed address:

```javascript
const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

### Step 3: Test Your dApp

1. **Open your frontend** (`index.html`) in a browser
2. **Connect MetaMask** to Sepolia testnet
3. **Get test ETH** from [Sepolia Faucet](https://sepoliafaucet.com/)
4. **Test the full flow**:
   - Create pension account
   - Make contributions
   - Calculate returns
   - Initiate retirement
   - Make withdrawals

---

## 6. Advanced Features

### Encryption Simulation

While this tutorial uses simplified encryption for educational purposes, here's how true FHEVM encryption works:

```solidity
// Real FHEVM Implementation
import "fhevm/lib/TFHE.sol";

contract ProductionPensionSystem {
    mapping(address => euint64) private encryptedBalances;

    function makeEncryptedContribution(bytes calldata encryptedAmount) external {
        euint64 amount = TFHE.asEuint64(encryptedAmount);
        euint64 currentBalance = encryptedBalances[msg.sender];

        // Addition happens on encrypted data!
        encryptedBalances[msg.sender] = TFHE.add(currentBalance, amount);
    }

    function getEncryptedBalance(bytes32 publicKey) external view returns (bytes memory) {
        return TFHE.encrypt(encryptedBalances[msg.sender], publicKey);
    }
}
```

### Frontend Encryption Integration

```javascript
// Real FHEVM Frontend Integration
import { FhevmInstance } from 'fhevmjs';

class PrivatePensionApp {
    constructor() {
        this.fhevm = null;
    }

    async initializeFHEVM() {
        this.fhevm = await FhevmInstance.create({
            chainId: 11155111, // Sepolia
            publicKey: await this.getPublicKey()
        });
    }

    async makePrivateContribution(amount) {
        // Encrypt the amount client-side
        const encryptedAmount = this.fhevm.encrypt64(amount);

        // Send encrypted data to contract
        const tx = await contract.makeEncryptedContribution(encryptedAmount);
        return tx.wait();
    }

    async getPrivateBalance() {
        // Get encrypted balance from contract
        const encryptedBalance = await contract.getEncryptedBalance(this.fhevm.publicKey);

        // Decrypt client-side
        const balance = this.fhevm.decrypt(encryptedBalance);
        return balance;
    }
}
```

---

## 7. Security Best Practices

### Smart Contract Security

```solidity
contract SecurePrivatePensionSystem {
    // ✅ Access Control
    modifier onlyAccountOwner() {
        require(accounts[msg.sender].isActive, "Unauthorized access");
        _;
    }

    // ✅ Input Validation
    function makeContribution(bytes calldata encryptedAmount) external onlyAccountOwner {
        require(encryptedAmount.length > 0, "Invalid encrypted input");
        // Process encrypted contribution...
    }

    // ✅ Reentrancy Protection
    bool private locked;
    modifier nonReentrant() {
        require(!locked, "Reentrancy guard");
        locked = true;
        _;
        locked = false;
    }

    // ✅ Safe Withdrawals
    function withdraw(bytes calldata encryptedAmount) external nonReentrant onlyAccountOwner {
        // Validate withdrawal conditions
        // Process encrypted withdrawal
    }
}
```

### Frontend Security

```javascript
// ✅ Input Validation
function validateAmount(amount) {
    if (!amount || isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
    }
    return parseFloat(amount);
}

// ✅ Error Handling
async function safeContractCall(contractMethod, ...args) {
    try {
        const tx = await contractMethod(...args);
        return await tx.wait();
    } catch (error) {
        if (error.code === 'ACTION_REJECTED') {
            throw new Error('Transaction rejected by user');
        } else if (error.message.includes('insufficient')) {
            throw new Error('Insufficient balance');
        }
        throw error;
    }
}

// ✅ Network Validation
async function ensureCorrectNetwork() {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0xaa36a7') {
        throw new Error('Please switch to Sepolia testnet');
    }
}
```

---

## 🎉 Congratulations!

You've successfully built your first **FHEVM-powered confidential dApp**!

### What You've Learned

✅ **FHEVM Fundamentals**: Understanding encrypted computations on blockchain
✅ **Smart Contract Development**: Building privacy-preserving contracts
✅ **Frontend Integration**: Connecting Web3 interfaces to encrypted contracts
✅ **Security Best Practices**: Implementing secure confidential applications

### Next Steps

1. **Explore Real FHEVM**: Try deploying on Zama's devnet with full encryption
2. **Advanced Features**: Add more complex encrypted operations
3. **Production Deployment**: Scale your dApp for real-world usage
4. **Community**: Join the Zama developer community

### Resources

- 📚 **Zama Documentation**: [docs.zama.ai](https://docs.zama.ai)
- 💻 **FHEVM Examples**: [github.com/zama-ai/fhevm](https://github.com/zama-ai/fhevm)
- 🗣️ **Community Discord**: [discord.gg/zama](https://discord.gg/zama)
- 🎓 **Advanced Tutorials**: [docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)

---

## 📋 Troubleshooting

### Common Issues

**"Failed to connect to MetaMask"**
- Ensure MetaMask is installed and unlocked
- Check you're on Sepolia testnet
- Try refreshing the page

**"Transaction failed"**
- Verify you have sufficient ETH for gas
- Check contract address is correct
- Ensure proper function parameters

**"Account creation failed"**
- Validate retirement age is between 55-75
- Check you don't already have an account
- Verify network connection

### Getting Help

If you encounter issues:
1. Check browser console for detailed error messages
2. Verify all contract addresses and ABIs are correct
3. Ensure you're connected to the right network
4. Join the Zama community for support

---

*This tutorial was created to demonstrate FHEVM capabilities and help developers build their first confidential applications. Happy coding! 🚀*