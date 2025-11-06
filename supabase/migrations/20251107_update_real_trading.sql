-- Update real trading schemas

-- Drop deprecated tables
DROP TABLE IF EXISTS "demo_trades";
DROP TABLE IF EXISTS "demo_balances";
DROP TABLE IF EXISTS "demo_orders";

-- Create exchange credentials table
CREATE TABLE IF NOT EXISTS "exchange_credentials" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    exchange VARCHAR(50) NOT NULL,
    api_key VARCHAR(200) NOT NULL,
    api_secret VARCHAR(200) NOT NULL,
    is_testnet BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, exchange)
);

-- Add market_type column to trading_orders if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'trading_orders' 
        AND column_name = 'market_type'
    ) THEN
        ALTER TABLE trading_orders
        ADD COLUMN market_type VARCHAR(20) CHECK (market_type IN ('crypto', 'forex', 'stocks', 'indices'));
    END IF;
END $$;

-- Add market_type column to trading_positions if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'trading_positions' 
        AND column_name = 'market_type'
    ) THEN
        ALTER TABLE trading_positions
        ADD COLUMN market_type VARCHAR(20) CHECK (market_type IN ('crypto', 'forex', 'stocks', 'indices'));
    END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_trading_orders_user_status ON trading_orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_trading_positions_user ON trading_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_real_balances_user ON real_balances(user_id);

-- Add RLS policies
ALTER TABLE exchange_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own exchange credentials"
    ON exchange_credentials
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

ALTER TABLE trading_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own orders"
    ON trading_orders
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

ALTER TABLE trading_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own positions"
    ON trading_positions
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

ALTER TABLE real_balances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own balances"
    ON real_balances
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);