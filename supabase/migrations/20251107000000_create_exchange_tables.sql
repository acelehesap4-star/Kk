CREATE TABLE exchange_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exchange VARCHAR NOT NULL,
  api_key VARCHAR NOT NULL,
  api_secret VARCHAR NOT NULL,
  passphrase VARCHAR,
  testnet BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, exchange)
);

CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exchange VARCHAR NOT NULL,
  order_id VARCHAR NOT NULL,
  client_order_id VARCHAR,
  symbol VARCHAR NOT NULL,
  side VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  quantity DECIMAL NOT NULL,
  price DECIMAL,
  stop_price DECIMAL,
  stop_limit_price DECIMAL,
  iceberg_qty DECIMAL,
  visible_size DECIMAL,
  status VARCHAR NOT NULL,
  filled_quantity DECIMAL DEFAULT 0,
  average_price DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE trades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  exchange VARCHAR NOT NULL,
  symbol VARCHAR NOT NULL,
  side VARCHAR NOT NULL,
  quantity DECIMAL NOT NULL,
  price DECIMAL NOT NULL,
  fee DECIMAL,
  fee_asset VARCHAR,
  trade_id VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE exchange_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only view their own exchange configs"
  ON exchange_configs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own exchange configs"
  ON exchange_configs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own exchange configs"
  ON exchange_configs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own exchange configs"
  ON exchange_configs FOR DELETE
  USING (auth.uid() = user_id);

-- Similar policies for orders and trades tables
CREATE POLICY "Users can only view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own orders"
  ON orders FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only view their own trades"
  ON trades FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own trades"
  ON trades FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own trades"
  ON trades FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own trades"
  ON trades FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX exchange_configs_user_id_idx ON exchange_configs(user_id);
CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX orders_symbol_idx ON orders(symbol);
CREATE INDEX trades_user_id_idx ON trades(user_id);
CREATE INDEX trades_order_id_idx ON trades(order_id);
CREATE INDEX trades_symbol_idx ON trades(symbol);