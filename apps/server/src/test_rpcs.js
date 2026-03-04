import { ethers } from 'ethers';

const RPCS = [
    'https://rpc-amoy.polygon.technology',
    'https://polygon-amoy-bor-rpc.publicnode.com',
    'https://1rpc.io/amoy',
    'https://rpc.ankr.com/polygon_amoy',
    'https://polygon-amoy.drpc.org'
];

async function test() {
    for (const rpc of RPCS) {
        console.log(`Testing RPC: ${rpc}`);
        try {
            const provider = new ethers.JsonRpcProvider(rpc, undefined, { staticNetwork: true });
            const block = await Promise.race([
                provider.getBlockNumber(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);
            console.log(`  SUCCESS: Block ${block}`);
        } catch (e) {
            console.log(`  FAILED: ${e.message}`);
        }
        console.log('---');
    }
}

test();
