import { ethers } from 'ethers';

const RPC_URL = 'https://polygon-amoy.drpc.org';
const CORRECT_ADDRESS = '0xcf91493d216158567395e3c028cc0ca093f007c6';

const SUSPECTED_ADDRESSES = [
    '0x41e941f147171800001d02c0c451da77d7000001',
    '0xAcC1945e0f5Ce9DE2dc27112aeeF09f96F4f6867',
    '0x1fdE0eCc61D4C092Cc9CCB715C81eaD1C59842f1',
    '0xc2132D05Dd3F05C7bB9a05ebcFE05b04B58e8F',
    '0x4c9327f566CE856F0a12d56037db653c6FBcAF72',
    '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    '0x5DAd8473cBaC1AdA34d7FEFe07270ed179619999',
    '0x38666795f7ef57d976008687a6b880c2936f322e'
];

const ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

async function check() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    console.log(`Diagnostic for ${CORRECT_ADDRESS} on Amoy...\n`);

    for (const addr of SUSPECTED_ADDRESSES) {
        try {
            const contract = new ethers.Contract(addr, ABI, provider);
            const balance = await contract.balanceOf(CORRECT_ADDRESS);
            const decimals = await contract.decimals();
            const symbol = await contract.symbol();
            const formatted = ethers.formatUnits(balance, decimals);

            console.log(`Address:  ${addr}`);
            console.log(`Symbol:   ${symbol}`);
            console.log(`Balance:  ${formatted}`);

            if (parseFloat(formatted) > 0) {
                console.log(`>>> FOUND IT: ${formatted} ${symbol} at ${addr} <<<`);
            }
            console.log('---');
        } catch (e) { }
    }
}

check();
