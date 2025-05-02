let provider = null;
let signer = null;
let currentAccount = null;

async function connectWallet() {
    try {
        // Check if Ethereum provider is available
        if (!window.ethereum) {
            alert('Please install MetaMask or another Ethereum wallet!');
            return;
        }

        // Create ethers provider and signer
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        currentAccount = await signer.getAddress();

        // Update UI
        updateConnectionState();
        setupAccountListeners();

        // Enable send button
        document.getElementById('send-tx-btn').disabled = false;

    } catch (error) {
        console.error('Connection error:', error);
        alert('Error connecting wallet: ' + error.message);
    }
}

function updateConnectionState() {
    const connectBtn = document.getElementById('connect-btn');
    if (currentAccount) {
        // Truncate address: first 6 + ... + last 4 characters
        const truncatedAddress = `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`;
        connectBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wallet2" viewBox="0 0 16 16">
                <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"/>
            </svg>
            ${truncatedAddress}
        `;
        connectBtn.classList.add('connected');
    } else {
        connectBtn.innerHTML = 'Connect';
        connectBtn.classList.remove('connected');
    }
}

function setupAccountListeners() {
    // Handle account changes
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            // Wallet disconnected
            currentAccount = null;
            updateConnectionState();
        } else if (accounts[0] !== currentAccount) {
            currentAccount = accounts[0];
            updateConnectionState();
        }
    });

    // Handle chain changes
    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });
}
// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', async () => {
    // Get the connect button element
    const connectBtn = document.getElementById('connect-btn');
    
    // Add click handler safely
    if (connectBtn) {
        connectBtn.addEventListener('click', connectWallet);
    } else {
        console.error('Connect button not found!');
    }

    // Rest of initialization...
    if (window.ethereum) {
        try {
            // CORRECTED: Use Web3Provider instead of BrowserProvider for ethers v5
            provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            
            if (accounts.length > 0) {
                signer = provider.getSigner();
                currentAccount = await signer.getAddress();
                updateConnectionState();
                setupAccountListeners();
                const sendBtn = document.getElementById('send-tx-btn');
                if (sendBtn) sendBtn.disabled = false;
            }
        } catch (error) {
            console.error('Initial connection check failed:', error);
        }
    }
});
// Connect the button
document.getElementById('connect-btn').addEventListener('click', connectWallet);