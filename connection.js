let provider = null;
let signer = null;
let currentAccount = null;

let chain1 = {
    name: 'BASE Mainnet',
    tokens: [
        {
            name: 'ETH',
            address: '0x'
        }
    ]
};

let chain2 = {
    name: 'Bittensor EVM',
    id : 123,
    tokens: [
        {
            name: 'BTC',
            address: '0x'
        }
    ]
};

async function connectWallet() {
    try {
        if (!window.ethereum) {
            alert('Please install MetaMask or another Ethereum wallet!');
            return;
        }

        // Use the modern provider detection
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        currentAccount = await signer.getAddress();

        updateConnectionState();
        setupAccountListeners();
        document.getElementById('send-tx-btn').disabled = false;

    } catch (error) {
        console.error('Connection error:', error);
        alert('Error connecting wallet: ' + error.message);
    }
}

function updateConnectionState() {
    const connectBtn = document.getElementById('connect-btn');
    if (currentAccount) {
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
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            currentAccount = null;
            updateConnectionState();
        } else if (accounts[0] !== currentAccount) {
            currentAccount = accounts[0];
            updateConnectionState();
        }
    });

    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });
}

// Wait for both DOM and ethers to be ready
function initializeWhenReady() {
    if (typeof ethers !== 'undefined' && document.readyState === 'complete') {
        setupConnection();
    } else {
        window.addEventListener('load', setupConnection);
    }
}

async function setupConnection() {
    try {
        const connectBtn = document.getElementById('connect-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', connectWallet);
        }

        if (window.ethereum && ethers) {
            provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            
            if (accounts.length > 0) {
                signer = await provider.getSigner();
                currentAccount = await signer.getAddress();
                updateConnectionState();
                setupAccountListeners();
                document.getElementById('send-tx-btn').disabled = false;
            }
        }
    } catch (error) {
        console.log('Initialization complete (non-critical):', error.message);
    }
}

// Start initialization
initializeWhenReady();