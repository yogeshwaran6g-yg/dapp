/**
 * API Endpoint Constants
 * All server endpoints are defined here. Import from this file instead of hardcoding URLs.
 */

const V1 = '/api/v1';

export const API_ENDPOINTS = {
    // ── Auth ─────────────────────────────────────────────
    AUTH: {
        NONCE: `${V1}/users/auth/nonce`,   // GET  — request a sign nonce
        VERIFY: `${V1}/users/auth/verify`,  // POST  — verify wallet signature & get JWT
        DEV_LOGIN: (address) => `${V1}/users/auth/devlogin/${address}`, // GET - bypass signature
    },


    // ── Profile ───────────────────────────────────────────
    PROFILE: {
        GET_BY_USER: (userId) => `${V1}/profile/${userId}`, // GET  — fetch profile by user_id (public)
        UPDATE: `${V1}/profile`,                        // PUT  — update own profile (auth)
        GET_ALL: `${V1}/profile`,                        // GET  — list all profiles (auth)
    },
    // ── Slot Activation ────────────────────────────────
    SLOT_ACTIVATION: {
        GET_BY_USER: (userId) => `${V1}/slot-activation/${userId}`, // GET  — fetch slot activation by user_id
        UPDATE: `${V1}/slot-activation`,                         // PUT  — update own slot activation
        GET_ADMIN_WALLET: `${V1}/slot-activation/config/admin-wallet`, // GET — fetch admin wallet
    },

    // ── Wallet ──────────────────────────────────────────
    WALLET: {
        BALANCE: `${V1}/wallet/balance`,               // GET  — fetch on-chain balances
        FAUCET: `${V1}/wallet/faucet`,                 // POST — request test eth
        INFO: `${V1}/wallet/info`,                     // GET  — fetch DB token balances
        STAKE_HISTORY: `${V1}/wallet/stake-history`,   // GET  — fetch stake history
        STAKE_INTERNAL: `${V1}/wallet/stake-internal`, // POST — stake own tokens
        CLAIM_REWARDS: `${V1}/wallet/claim-rewards`,   // POST — claim rewards
        UPDATE_BALANCE: `${V1}/wallet/update-balance`, // POST — update balance (testing)
        TOPUP_INTERNAL: `${V1}/wallet/topup-internal`, // POST — top up internal balance
    },

    // ── Referral ──────────────────────────────────────────
    REFERRAL: {
        STATS: `${V1}/referral/stats`,
        NETWORK: `${V1}/referral/network`,
    },
};
