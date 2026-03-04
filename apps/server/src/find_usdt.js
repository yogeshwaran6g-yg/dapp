import { ethers } from 'ethers';

const RPC_URL = 'https://rpc-amoy.polygon.technology';
const WALLET_ADDRESS = '0x314094fc50df22739c14e4d993d647aa2d20cd83';

const CANDIDATES = [
    '0xc2132D059Ac9E4cd988EEdC7C9E7978ABbCe48b0', // Mainnet USDT (PoS)
    '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582', // Common Amoy USDT
    '0xAcC1945e0f5Ce9DE2dc27112aeeF09f96F4f6867',
    '0x1fdE0ECC61D4C092cc9CCB715C81eaD1C59842f1',
    '0x41e941f147171800001d02c0c451da77d7000001',
    '0xF6243A3060879e5822269dBa912d357f6629A24a',
    '0x522d64571A11756281734313B0E68868Aca0A34F',
    '0x4c9327f566CE856F0a12d56037db653c6FBcAF72',
    '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    '0xd366E3A39B1A53E417AAb0f1E8Af9D88998D0111',
    '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    '0xAB32EAed1B1c2afa890a354B6D7D8BA730AcA434'
];

const ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

async function check() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    console.log(`Checking candidates for ${WALLET_ADDRESS}...`);

    for (const addr of CANDIDATES) {
        try {
            const contract = new ethers.Contract(addr, ABI, provider);
            const [balance, decimals, symbol] = await Promise.all([
                contract.balanceOf(WALLET_ADDRESS),
                contract.decimals().catch(() => 18),
                contract.symbol().catch(() => '???')
            ]);

            if (balance > 0n) {
                console.log(`[FOUND] ${symbol}: ${ethers.formatUnits(balance, decimals)} at ${addr}`);
            }
        } catch (e) {
            // console.log(`Error checking ${addr}`);
        }
    }
}

check();
