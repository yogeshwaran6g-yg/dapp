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
    profile_picture TEXT,
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

CREATE TABLE IF NOT EXISTS yeild (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(18, 6) NOT NULL,
    asset VARCHAR(50) NOT NULL DEFAULT 'USDT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_staking_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_wallets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    energy_balance DECIMAL(18, 6) DEFAULT 0,
    own_token DECIMAL(18, 6) DEFAULT 0,
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
    type VARCHAR(50) NOT NULL CHECK (
        type IN (
            'INFLOW',
            'PAYOUT',
            'TRANSFER'
        )
    ),
    asset VARCHAR(50) NOT NULL,
    amount DECIMAL(18, 6) NOT NULL,
    usd_value DECIMAL(18, 2) NOT NULL,
    tx_hash VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Initial seeding for system funds
INSERT INTO
    system_funds (fund_name)
VALUES ('ROYALTY'),
    ('PRODUCT'),
    ('DEVELOPERS'),
    ('EXPENSE'),
    ('DEVELOPMENT') ON CONFLICT (fund_name) DO NOTHING;

CREATE TABLE IF NOT EXISTS stake_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(18, 6) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (
        type IN ('STAKE', 'REWARD_CLAIM')
    ),
    tx_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stake_history_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stake_status') THEN
        CREATE TYPE stake_status AS ENUM ('ACTIVE', 'UNSTAKED');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS internal_stakes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(18, 6) NOT NULL,
    admin_address VARCHAR(255) DEFAULT '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    staked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status stake_status DEFAULT 'ACTIVE',
    CONSTRAINT fk_internal_stake_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS income_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- The referrer who received the commission
    source_user_id BIGINT NOT NULL, -- The user who activated the slot
    amount DECIMAL(18, 6) NOT NULL,
    level INTEGER NOT NULL, -- 1, 2, 3, or 4
    type VARCHAR(50) NOT NULL DEFAULT 'COMMISSION',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_income_logs_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_income_logs_source FOREIGN KEY (source_user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_profile_user_id ON profile(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_username_lower ON profile(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_user_wallets_user_id ON user_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_nfts_user_id ON user_nfts(user_id);
CREATE INDEX IF NOT EXISTS idx_stake_history_user_id ON stake_history(user_id);
CREATE INDEX IF NOT EXISTS idx_stake_history_created_at ON stake_history(created_at);
CREATE INDEX IF NOT EXISTS idx_internal_stakes_user_id ON internal_stakes(user_id);
CREATE INDEX IF NOT EXISTS idx_internal_stakes_status ON internal_stakes(status);
CREATE INDEX IF NOT EXISTS idx_yeild_user_id ON yeild(user_id);

CREATE TABLE IF NOT EXISTS tickets (
    id BIGSERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Closed')),
    priority VARCHAR(50) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    category VARCHAR(50) DEFAULT 'Other',
    user_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);



CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);

CREATE INDEX IF NOT EXISTS idx_treasury_logs_created_at ON treasury_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_income_logs_user_id ON income_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_income_logs_created_at ON income_logs(created_at);

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
);

CREATE INDEX IF NOT EXISTS idx_swap_history_user_id ON swap_history(user_id);
CREATE INDEX IF NOT EXISTS idx_swap_history_created_at ON swap_history(created_at);

-- Dummy data for swap history
-- Assuming user IDs 1, 2, 3 exist from previous seeding or activity
INSERT INTO swap_history (user_id, from_asset, to_asset, from_amount, to_amount, tx_hash, status, created_at)
VALUES 
(1, 'USDT', 'OWN', 100.00, 85.42, '0x' || encode(gen_random_bytes(20), 'hex'), 'COMPLETED', NOW() - INTERVAL '1 hour'),
(1, 'USDT', 'ENERGY', 50.00, 58.50, '0x' || encode(gen_random_bytes(20), 'hex'), 'COMPLETED', NOW() - INTERVAL '2 hours'),
(2, 'OWN', 'USDT', 200.00, 230.15, '0x' || encode(gen_random_bytes(20), 'hex'), 'COMPLETED', NOW() - INTERVAL '3 hours'),
(2, 'OWN', 'ENERGY', 150.00, 175.20, '0x' || encode(gen_random_bytes(20), 'hex'), 'COMPLETED', NOW() - INTERVAL '4 hours'),
(3, 'USDT', 'OWN', 500.00, 427.10, '0x' || encode(gen_random_bytes(20), 'hex'), 'PENDING', NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;
