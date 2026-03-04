import { ethers } from 'ethers';

const RPC_URL = 'https://rpc-amoy.polygon.technology';
const USER_ADDRESS = '0xc5bbc1fdfc9c88d6253bbd072bf3b8252287faf0';

// A wide net of possible USDT/stablecoin addresses on Amoy/Mumbai
const SUSPECTED_ADDRESSES = [
    '0xAcC1945e0f5Ce9DE2dc27112aeeF09f96F4f6867',
    '0x1fdE0eCc61D4C092Cc9CCB715C81eaD1C59842f1',
    '0xc2132D059Ac9E4cd988EEdC7C9E7978ABbCe48b0',
    '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    '0x41e941f147171800001d02c0c451da77d7000001',
    '0x38666795f7ef57d976008687a6b880c2936f322e',
    '0x4c9327f5d179619999a70b60136691c6fccaf72', // Current one (just in case)
    '0x5DAd8473cBaC1AdA34d7FEFe07270ed179619999'
];

const ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

async function check() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    console.log(`Diagnostic for ${USER_ADDRESS} on Amoy...\n`);

    for (const addr of SUSPECTED_ADDRESSES) {
        if (!ethers.isAddress(addr)) continue;

        try {
            const contract = new ethers.Contract(addr, ABI, provider);
            // Non-blocking checks
            const balancePromise = contract.balanceOf(USER_ADDRESS);
            const symbolPromise = contract.symbol();
            const decimalsPromise = contract.decimals();

            const balance = await balancePromise.catch(() => null);
            if (balance !== null) {
                const symbol = await symbolPromise.catch(() => "???");
                const decimals = await decimalsPromise.catch(() => 18);
                const formatted = ethers.formatUnits(balance, decimals);

                console.log(`TOKEN FOUND: ${symbol}`);
                console.log(`Address:     ${addr}`);
                console.log(`Balance:     ${formatted}`);
                console.log('---');
            }
        } catch (e) {
            // console.log(`Error at ${addr}: ${e.message}`);
        }
    }
}

check();
