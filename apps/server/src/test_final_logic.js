import * as blockchainService from './services/blockchainService.js';

const ADDRESS = '0xcf91493d216158567395e3c028cc0ca093f007c6';

async function test() {
    try {
        console.log(`Starting balance check for ${ADDRESS}...`);
        const balances = await blockchainService.getWalletBalance(ADDRESS);
        console.log('\nResult:', balances);
    } catch (e) {
        console.error('Test Failed:', e);
    }
}

test();
