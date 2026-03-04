import { ethers } from 'ethers';

const RPC_URL = 'https://polygon-amoy.drpc.org';
const ADDRESS = '0xcf91493d216158567395e3c028cc0ca093f007c6';

const ADDRS = [
    '0x1fde0ecc61d4c092cc9ccb715c81ead1c59842f1',
    '0xAcC1945e0f5Ce9DE2dc27112aeeF09f96F4f6867',
    '0x4c9327f566CE856F0a12d56037db653c6FBcAF72',
    '0xc2132D05Dd3F05C7bB9a05ebcFE05b04B58e8F',
    '0x41e941f147171800001d02c0c451da77d7000001',
    '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    '0x5DAd8473cBaC1AdA34d7FEFe07270ed179619999',
    '0x38666795f7ef57d976008687a6b880c2936f322e',
    '0xc2132D059Ac9E4cd988EEdC7C9E7978ABbCe48b0'
];

const ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

async function run() {
    const provider = new ethers.JsonRpcProvider(RPC_URL, undefined, { staticNetwork: true });
    console.log(`Checking ${ADDRESS} on Amoy...`);

    for (const a of ADDRS) {
        try {
            const c = new ethers.Contract(a, ABI, provider);
            const bal = await Promise.race([
                c.balanceOf(ADDRESS),
                new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), 10000))
            ]);
            const dec = await c.decimals();
            const sym = await c.symbol();
            const fmt = ethers.formatUnits(bal, dec);
            console.log(`[${a}] ${sym}: ${fmt}`);
            if (parseFloat(fmt) > 0) {
                console.log(`\n!!! FOUND BALANCE: ${fmt} ${sym} at ${a} !!!\n`);
            }
        } catch (e) {
            console.log(`[${a}] Error: ${e.message}`);
        }
    }
}

run();
