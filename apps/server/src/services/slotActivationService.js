import { queryRunner } from '../config/db.js';
import { serviceResponse } from '../utils/helper.js';

/**
 * Fetch slot activation/levels for a user
 * @param {string|number} userId 
 * @returns {Promise<Object>}
 */
export const getSlotActivation = async (userId) => {
    try {
        const result = await queryRunner(
            'SELECT * FROM levels WHERE id = $1',
            [userId]
        );

        if (result.length === 0) {
            // If not found, create a default entry
            await queryRunner(
                'INSERT INTO levels (id, current_level_id) VALUES ($1, 1)',
                [userId]
            );
            return serviceResponse(true, 200, 'Default slot activation created', { current_level_id: 1 });
        }

        return serviceResponse(true, 200, 'Slot activation fetched successfully', result[0]);
    } catch (err) {
        console.error(`[SlotActivationService] Error in getSlotActivation: ${err.message}`);
        return serviceResponse(false, 500, 'Error fetching slot activation', null, err.message);
    }
};

/**
 * Update slot activation/level for a user
 * @param {string|number} userId 
 * @param {number} currentLevelId 
 * @returns {Promise<Object>}
 */
export const updateSlotActivation = async (userId, currentLevelId) => {
    try {
        await queryRunner(
            'UPDATE levels SET current_level_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [currentLevelId, userId]
        );

        return serviceResponse(true, 200, 'Slot activation updated successfully');
    } catch (err) {
        console.error(`[SlotActivationService] Error in updateSlotActivation: ${err.message}`);
        return serviceResponse(false, 500, 'Error updating slot activation', null, err.message);
    }
};
