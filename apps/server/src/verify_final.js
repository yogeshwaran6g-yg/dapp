import { ethers } from 'ethers';

const RPC_URL = 'https://rpc.ankr.com/polygon_amoy';
const USER_ADDRESS = '0xc5bbc1fdfc9c88d6253bbd072bf3b8252287faf0';

const ADDR = '0x4c9327f566CE856F0a12d56037db653c6FBcAF72';

const ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

async function check() {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(ADDR, ABI, provider);

        const [balance, decimals, symbol] = await Promise.all([
            contract.balanceOf(USER_ADDRESS),
            contract.decimals(),
            contract.symbol()
        ]);

        console.log(`Address:     ${ADDR}`);
        console.log(`Symbol:      ${symbol}`);
        console.log(`Balance:     ${ethers.formatUnits(balance, decimals)}`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

check();
