import { ethers } from 'ethers';

const RPC_URL = 'https://rpc-amoy.polygon.technology';
const USER_ADDRESS = '0xc5bbc1fdfc9c88d6253bbd072bf3b8252287faf0';

const SUSPECTED_ADDRESSES = [
    '0x4c9327f5d179619999a70b60136691c6fccaf72', // Current one (suspected typo)
    '0x4c9327f55b9e072f957088b90a421b88e1a1c6fbcaf72', // From search 319
    '0xc2132D059Ac9E4cd988EEdC7C9E7978ABbCe48b0', // POS USDT
    '0x1fdE0eCc61D4C092Cc9CCB715C81eaD1C59842f1', // Common Mock
    '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa', // Common Mock 2
    '0x4c9327f5c6fbcaf72' // Truncated but maybe prefix is enough? No, must be full.
];

const ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

async function check() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    console.log(`Checking balances for ${USER_ADDRESS}...\n`);

    for (const addr of SUSPECTED_ADDRESSES) {
        if (!ethers.isAddress(addr)) {
            console.log(`Invalid address: ${addr}\n`);
            continue;
        }

        try {
            const contract = new ethers.Contract(addr, ABI, provider);
            const [balance, decimals, symbol] = await Promise.all([
                contract.balanceOf(USER_ADDRESS).catch(() => null),
                contract.decimals().catch(() => null),
                contract.symbol().catch(() => "???")
            ]);

            if (balance !== null) {
                const formatted = ethers.formatUnits(balance, decimals || 18);
                console.log(`Address: ${addr}`);
                console.log(`Symbol:  ${symbol}`);
                console.log(`Balance: ${formatted}`);
                console.log('---');
            }
        } catch (e) {
            console.log(`Error checking ${addr}: ${e.message}`);
        }
    }
}

check();
