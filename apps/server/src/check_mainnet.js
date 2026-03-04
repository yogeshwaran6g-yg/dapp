import { ethers } from 'ethers';

const RPC_URL = 'https://polygon-rpc.com';
const ADDRESS = '0xcf91493d216158567395e3c028cc0ca093f007c6';
const USDT_MAINNET = '0xc2132D059Ac9E4cd988EEdC7C9E7978ABbCe48b0';

async function check() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    console.log(`Checking MAINNET balances for ${ADDRESS}...\n`);

    try {
        const pol = await provider.getBalance(ADDRESS);
        console.log(`Native POL: ${ethers.formatEther(pol)}`);

        const usdt = new ethers.Contract(USDT_MAINNET, ["function balanceOf(address) view returns (uint256)"], provider);
        const bal = await usdt.balanceOf(ADDRESS);
        console.log(`USDT Balance: ${ethers.formatUnits(bal, 6)}`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

check();
