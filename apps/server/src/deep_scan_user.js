import { ethers } from 'ethers';

const RPC_URL = 'https://rpc-amoy.polygon.technology';
const ADDRESS = '0xcf91493d216158567395e3c028cc0ca093f007c6';

// Wide range of potential USDT/Test tokens on Amoy
const CANDIDATES = [
    '0xc2132D05Dd3F05C7bB9a05ebcFE05b04B58e8F', // Likely USDT
    '0xAcC1945e0f5Ce9DE2dc27112aeeF09f96F4f6867', // Common Mock
    '0x1fde0ecc61d4c092cc9ccb715c81ead1c59842f1', // Mock USDT
    '0x4c9327f566CE856F0a12d56037db653c6FBcAF72', // Prefix match
    '0x41e941f147171800001d02c0c451da77d7000001', // Common Amoy Token
    '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa', // Mock
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC (Mainnet proxy)
    '0x7FFB3d637014488b63fb9858E279385685AFc1e2', // Wrapped BTC
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
    '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'  // USDC on Amoy
];

const ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
];

async function scan() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    console.log(`Scanning balances for ${ADDRESS}...\n`);

    // 1. Check Native POL
    try {
        const bal = await provider.getBalance(ADDRESS);
        console.log(`Native POL: ${ethers.formatEther(bal)}`);
    } catch (e) {
        console.log(`Native POL Error: ${e.message}`);
    }
    console.log('---');

    // 2. Scan Tokens
    for (const a of CANDIDATES) {
        try {
            const c = new ethers.Contract(a, ABI, provider);
            const [bal, dec, sym, name] = await Promise.all([
                c.balanceOf(ADDRESS),
                c.decimals().catch(() => 18),
                c.symbol().catch(() => "???"),
                c.name().catch(() => "Unknown")
            ]);

            const fmt = ethers.formatUnits(bal, dec);
            console.log(`[${a}]`);
            console.log(`  Name:   ${name} (${sym})`);
            console.log(`  Balance: ${fmt}`);
            if (parseFloat(fmt) > 0) {
                console.log(`  >>> FOUND BALANCE! <<<`);
            }
        } catch (e) {
            // console.log(`[${a}] Failed: ${e.message}`);
        }
    }
}

scan();
