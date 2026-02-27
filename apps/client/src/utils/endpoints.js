/**
 * API Endpoint Constants
 * All server endpoints are defined here. Import from this file instead of hardcoding URLs.
 */

const V1 = '/v1';

export const API_ENDPOINTS = {
    // ── Auth ─────────────────────────────────────────────
    AUTH: {
        NONCE: '/users/auth/nonce',   // POST  — request a sign nonce
        VERIFY: '/users/auth/verify',  // POST  — verify wallet signature & get JWT
    },

    // ── Profile ───────────────────────────────────────────
    PROFILE: {
        GET_BY_USER: (userId) => `${V1}/profile/${userId}`, // GET  — fetch profile by user_id (public)
        UPDATE: `${V1}/profile`,                        // PUT  — update own profile (auth)
        GET_ALL: `${V1}/profile`,                        // GET  — list all profiles (auth)
    },
};
