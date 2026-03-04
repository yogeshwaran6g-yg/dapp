import { ethers } from 'ethers';

const RPCS = [
    'https://polygon-bor-rpc.publicnode.com',
    'https://polygon-rpc.com',
    'https://1rpc.io/polygon'
];
const ADDRESS = '0xcf91493d216158567395e3c028cc0ca093f007c6';
const USDT_MAINNET = '0xc2132D059Ac9E4cd988EEdC7C9E7978ABbCe48b0';

async function check() {
    console.log(`Deep Check for ${ADDRESS} on Multiple RPCs...\n`);

    for (const url of RPCS) {
        console.log(`Trying RPC: ${url}`);
        try {
            const provider = new ethers.JsonRpcProvider(url, undefined, { staticNetwork: true });
            const [pol, block] = await Promise.all([
                provider.getBalance(ADDRESS),
                provider.getBlockNumber()
            ]);

            console.log(`  Connected! Block: ${block}`);
            console.log(`  Native POL: ${ethers.formatEther(pol)}`);

            const usdt = new ethers.Contract(USDT_MAINNET, ["function balanceOf(address) view returns (uint256)"], provider);
            const bal = await usdt.balanceOf(ADDRESS);
            console.log(`  USDT Balance: ${ethers.formatUnits(bal, 6)}`);
            break; // Success
        } catch (e) {
            console.log(`  Failed: ${e.message}`);
        }
    }
}

check();
