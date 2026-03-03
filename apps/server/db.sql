CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    wallet_address VARCHAR(255) NOT NULL UNIQUE,
    chain_id INTEGER NOT NULL DEFAULT 1,
    nonce VARCHAR(255) NOT NULL,
    last_login_at TIMESTAMP NULL,
    referral_code VARCHAR(50) NOT NULL UNIQUE,
    referred_by BIGINT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    fake_eth_balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_referred_by FOREIGN KEY (referred_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    username VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20),
    dob DATE,
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS levels (
    id bigint NOT NULL PRIMARY KEY,
    current_level_id INT NOT NULL DEFAULT 1,
    total_xp BIGINT NOT NULL DEFAULT 0,
    last_leveled_up TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_wallets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    energy_balance DECIMAL(18, 6) DEFAULT 0,
    reward_token_balance DECIMAL(18, 6) DEFAULT 0,
    locked_balance DECIMAL(18, 6) DEFAULT 0,
    version INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_nfts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    contract_address VARCHAR(42) NOT NULL,
    token_id VARCHAR(100) NOT NULL,
    metadata_uri TEXT NULL,
    is_staked BOOLEAN DEFAULT FALSE,
    staked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (contract_address, token_id),
    CONSTRAINT fk_nft_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS system_funds (
    id SERIAL PRIMARY KEY,
    fund_name VARCHAR(100) NOT NULL UNIQUE,
    balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS treasury_logs (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('INFLOW', 'PAYOUT', 'TRANSFER')),
    asset VARCHAR(50) NOT NULL,
    amount DECIMAL(18, 6) NOT NULL,
    usd_value DECIMAL(18, 2) NOT NULL,
    tx_hash VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE user_nfts (
--     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
--     user_id BIGINT UNSIGNED NOT NULL,
--     contract_address VARCHAR(42) NOT NULL,
--     token_id VARCHAR(100) NOT NULL,
--     metadata_uri TEXT NULL,
--     is_staked BOOLEAN DEFAULT FALSE,
--     staked_at DATETIME NULL,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE KEY uq_user_nft (contract_address, token_id),
--     FOREIGN KEY (user_id) REFERENCES users(id)
-- );
-- Initial seeding for system funds
INSERT INTO system_funds (fund_name) VALUES 
('ROYALTY'), ('PRODUCT'), ('DEVELOPERS'), ('EXPENSE'), ('DEVELOPMENT')
ON CONFLICT (fund_name) DO NOTHING;
