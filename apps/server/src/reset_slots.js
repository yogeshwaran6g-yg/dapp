import { queryRunner } from './config/db.js';

const resetUserSlots = async (userId) => {
    try {
        console.log(`Resetting slots for User ID: ${userId}`);

        // Reset slot activation
        // Resetting to Level 1 (base level)
        await queryRunner('UPDATE levels SET current_level_id = 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [userId]);

        console.log("Reset successful! You can now test Level 2+ activation.");
        process.exit(0);
    } catch (error) {
        console.error("Error resetting slots:", error);
        process.exit(1);
    }
};

resetUserSlots('12');
