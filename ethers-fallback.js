// Minimal ethers.js fallback for basic functionality
console.log('Loading ethers fallback...');

window.ethers = {
    BrowserProvider: function(provider) {
        this.provider = provider;
        this.getSigner = async function() {
            const accounts = await this.provider.request({ method: 'eth_accounts' });
            return {
                address: accounts[0],
                sendTransaction: async (tx) => {
                    return await this.provider.request({ 
                        method: 'eth_sendTransaction', 
                        params: [tx] 
                    });
                }
            };
        };
    },
    Contract: function(address, abi, signer) {
        this.address = address;
        this.abi = abi;
        this.signer = signer;
        
        // Mock contract methods
        this.createPensionAccount = async (age, encryptedAge) => {
            console.log('Mock: createPensionAccount called');
            return { wait: async () => ({ status: 1 }) };
        };
        
        this.makeContribution = async (encryptedAmount) => {
            console.log('Mock: makeContribution called');
            return { wait: async () => ({ status: 1 }) };
        };
        
        this.withdraw = async (encryptedAmount) => {
            console.log('Mock: withdraw called');
            return { wait: async () => ({ status: 1 }) };
        };
        
        this.initiateRetirement = async () => {
            console.log('Mock: initiateRetirement called');
            return { wait: async () => ({ status: 1 }) };
        };
        
        this.calculateReturns = async () => {
            console.log('Mock: calculateReturns called');
            return { wait: async () => ({ status: 1 }) };
        };
        
        this.getAccountInfo = async () => {
            return [0, 0, false, 0]; // Mock: no existing account
        };
        
        this.once = (event, callback) => {
            console.log('Mock event listener for:', event);
        };
    },
    randomBytes: function(length) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return array;
    }
};

console.log('Ethers fallback loaded successfully');