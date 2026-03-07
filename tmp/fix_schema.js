import { queryRunner } from './apps/server/src/config/db.js';

async function fixSchema() {
    try {
        console.log("Checking income_logs schema...");
        const columns = await queryRunner("SELECT column_name FROM information_schema.columns WHERE table_name = 'income_logs'");
        const columnNames = columns.map(c => c.column_name);

        if (!columnNames.includes('tx_hash')) {
            console.log("Adding tx_hash column to income_logs...");
            await queryRunner("ALTER TABLE income_logs ADD COLUMN tx_hash VARCHAR(255)");
            console.log("Added tx_hash column.");
        } else {
            console.log("tx_hash column already exists.");
        }

        process.exit(0);
    } catch (err) {
        console.error("Error fixing schema:", err);
        process.exit(1);
    }
}

fixSchema();
