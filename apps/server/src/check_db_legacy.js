import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    connectionString: "postgresql://postgres:arun123@localhost:5432/dapp"
});

async function check() {
    try {
        await client.connect();
        const res = await client.query("SELECT * FROM user_wallets WHERE user_id = '14'");
        console.log('Wallet Data:', res.rows[0]);
    } catch (e) {
        console.error(e.message);
    } finally {
        await client.end();
    }
}

check();
