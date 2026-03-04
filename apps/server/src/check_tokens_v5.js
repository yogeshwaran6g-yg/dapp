import { ethers } from 'ethers';

const RPC_URL = 'https://polygon-amoy.drpc.org'; // Trying another RPC
const USER_ADDRESS = '0xc5bbc1fdfc9c88d6253bbd072bf3b8252287faf0';

const SUSPECTED_ADDRESSES = [
    '0x4c9327f566CE856F0a12d56037db653c6FBcAF72',
    '0xc2132D05Dd3F05C7bB9a05ebcFE05b04B58e8F',
    '0xAcC1945e0f5Ce9DE2dc27112aeeF09f96F4f6867',
    '0x1fdE0eCc61D4C092Cc9CCB715C81eaD1C59842f1',
    '0x41e941f147171800001d02c0c451da77d7000001',
    '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    '0x5DAd8473cBaC1AdA34d7FEFe07270ed179619999',
    '0x38666795f7ef57d976008687a6b880c2936f322e',
    '0x0000000000000000000000000000000000001010' // MATIC (POL)
];

const ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
];

async function check() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    console.log(`Deep Diagnostic for ${USER_ADDRESS} on Amoy...\n`);

    for (const addr of SUSPECTED_ADDRESSES) {
        try {
            const contract = new ethers.Contract(addr, ABI, provider);
            const balance = await contract.balanceOf(USER_ADDRESS);

            const [symbol, name, decimals] = await Promise.all([
                contract.symbol().catch(() => "???"),
                contract.name().catch(() => "Unknown"),
                contract.decimals().catch(() => 18)
            ]);

            const formatted = ethers.formatUnits(balance, decimals);

            console.log(`Address:  ${addr}`);
            console.log(`Name:     ${name} (${symbol})`);
            console.log(`Balance:  ${formatted}`);
            console.log('---');

            if (parseFloat(formatted) > 0) {
                console.log(`>>> MATCH FOUND: ${symbol} (${formatted}) at ${addr} <<<`);
            }
        } catch (e) {
            // Skip non-contracts or errors
        }
    }
}

check();
