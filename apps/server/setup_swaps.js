import pool from './src/config/db.js';

async function setupSwaps() {
    try {
        console.log('--- Swap History Setup ---');
        
        // 1. Create table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS swap_history (
                id BIGSERIAL PRIMARY KEY,
                user_id BIGINT NOT NULL,
                from_asset VARCHAR(50) NOT NULL,
                to_asset VARCHAR(50) NOT NULL,
                from_amount DECIMAL(18, 6) NOT NULL,
                to_amount DECIMAL(18, 6) NOT NULL,
                tx_hash VARCHAR(255),
                status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_swap_history_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        `);
        console.log('✅ swap_history table ensured.');

        // 2. Add indexes
        await pool.query('CREATE INDEX IF NOT EXISTS idx_swap_history_user_id ON swap_history(user_id)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_swap_history_created_at ON swap_history(created_at)');
        console.log('✅ Indexes ensured.');

        // 3. Check for existing users to seed valid data
        const userRes = await pool.query('SELECT id FROM users LIMIT 1');
        if (userRes.rows.length === 0) {
            console.log('⚠️ No users found in users table. Skipping dummy data seeding.');
            console.log('   Please create a user first for the dummy data to be visible.');
        } else {
            const firstUserId = userRes.rows[0].id;
            
            // 4. Seed dummy data
            const checkData = await pool.query('SELECT id FROM swap_history LIMIT 1');
            if (checkData.rows.length === 0) {
                await pool.query(`
                    INSERT INTO swap_history (user_id, from_asset, to_asset, from_amount, to_amount, tx_hash, status, created_at)
                    VALUES 
                    ($1, 'USDT', 'OWN', 100.00, 85.42, '0x8b32...434a', 'COMPLETED', NOW() - INTERVAL '1 hour'),
                    ($1, 'USDT', 'ENERGY', 50.00, 58.50, '0xc5bb...faf0', 'COMPLETED', NOW() - INTERVAL '2 hours'),
                    ($1, 'OWN', 'USDT', 200.00, 230.15, '0xab32...a434', 'COMPLETED', NOW() - INTERVAL '3 hours'),
                    ($1, 'OWN', 'ENERGY', 150.00, 175.20, '0x71c2...4e2a', 'COMPLETED', NOW() - INTERVAL '4 hours'),
                    ($1, 'USDT', 'OWN', 500.00, 427.10, '0x9d32...5b32', 'PENDING', NOW() - INTERVAL '30 minutes')
                `, [firstUserId]);
                console.log(`✅ Dummy swap data seeded for userId: ${firstUserId}`);
            } else {
                console.log('ℹ️ Swap history data already exists.');
            }
        }

        console.log('--- Setup Complete ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during setup:', err);
        process.exit(1);
    }
}

setupSwaps();
