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
    own_token_balance DECIMAL(18, 6) DEFAULT 0,
    locked_balance DECIMAL(18, 6) DEFAULT 0,
    version INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_wallets' AND column_name = 'reward_token_balance') THEN
        ALTER TABLE user_wallets RENAME COLUMN reward_token_balance TO own_token_balance;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_wallets' AND column_name = 'usdt_balance') THEN
        ALTER TABLE user_wallets ADD COLUMN usdt_balance DECIMAL(18, 6) DEFAULT 0;
    END IF;
END $$;

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

CREATE TABLE IF NOT EXISTS swaps (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    swap_type VARCHAR(50) NOT NULL, -- 'USDT_TO_OWN', 'USDT_TO_ENERGY', 'OWN_TO_USDT', 'OWN_TO_ENERGY'
    from_token VARCHAR(20) NOT NULL,
    to_token VARCHAR(20) NOT NULL,
    from_amount DECIMAL(18, 6) NOT NULL,
    to_amount DECIMAL(18, 6) NOT NULL,
    rate DECIMAL(18, 8) NOT NULL,
    status VARCHAR(20) DEFAULT 'COMPLETED',
    tx_hash VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_swap_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'swaps' AND column_name = 'swap_type') THEN
        ALTER TABLE swaps ADD COLUMN swap_type VARCHAR(50) NOT NULL DEFAULT 'USDT_TO_OWN';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'swaps' AND column_name = 'from_token') THEN
        ALTER TABLE swaps ADD COLUMN from_token VARCHAR(20) NOT NULL DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'swaps' AND column_name = 'to_token') THEN
        ALTER TABLE swaps ADD COLUMN to_token VARCHAR(20) NOT NULL DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'swaps' AND column_name = 'from_amount') THEN
        ALTER TABLE swaps ADD COLUMN from_amount DECIMAL(18, 6) NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'swaps' AND column_name = 'to_amount') THEN
        ALTER TABLE swaps ADD COLUMN to_amount DECIMAL(18, 6) NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'swaps' AND column_name = 'rate') THEN
        ALTER TABLE swaps ADD COLUMN rate DECIMAL(18, 8) NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users (referred_by);

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);

CREATE INDEX IF NOT EXISTS idx_profile_user_id ON profile (user_id);

CREATE INDEX IF NOT EXISTS idx_profile_username_lower ON profile (LOWER(username));

CREATE INDEX IF NOT EXISTS idx_user_wallets_user_id ON user_wallets (user_id);

CREATE INDEX IF NOT EXISTS idx_user_nfts_user_id ON user_nfts (user_id);

CREATE INDEX IF NOT EXISTS idx_stake_history_user_id ON stake_history (user_id);

CREATE INDEX IF NOT EXISTS idx_stake_history_created_at ON stake_history (created_at);

CREATE INDEX IF NOT EXISTS idx_internal_stakes_user_id ON internal_stakes (user_id);

CREATE INDEX IF NOT EXISTS idx_internal_stakes_status ON internal_stakes (status);

CREATE INDEX IF NOT EXISTS idx_yeild_user_id ON yeild (user_id);

CREATE INDEX IF NOT EXISTS idx_treasury_logs_created_at ON treasury_logs (created_at);

CREATE INDEX IF NOT EXISTS idx_swaps_user_id ON swaps (user_id);

CREATE INDEX IF NOT EXISTS idx_swaps_swap_type ON swaps (swap_type);

CREATE INDEX IF NOT EXISTS idx_swaps_created_at ON swaps (created_at);