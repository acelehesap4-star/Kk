-- Gerçek işlem stored procedure'ları
CREATE OR REPLACE FUNCTION execute_trade(
  p_user_id UUID,
  p_market_type VARCHAR,
  p_symbol VARCHAR,
  p_side VARCHAR,
  p_order_type VARCHAR,
  p_quantity DECIMAL,
  p_price DECIMAL,
  p_exchange VARCHAR
) RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_balance DECIMAL;
  v_required_balance DECIMAL;
BEGIN
  -- Bakiye kontrolü
  SELECT free_balance INTO v_balance 
  FROM real_balances 
  WHERE user_id = p_user_id 
    AND market_type = p_market_type
    AND exchange = p_exchange;

  IF p_order_type = 'market' THEN
    v_required_balance = p_quantity;
  ELSE
    v_required_balance = p_quantity * p_price;
  END IF;

  IF v_balance < v_required_balance THEN
    RAISE EXCEPTION 'Yetersiz bakiye';
  END IF;

  -- Yeni emir oluştur
  INSERT INTO trading_orders (
    id,
    user_id,
    market_type,
    symbol,
    side,
    order_type,
    quantity,
    price,
    status,
    exchange
  ) VALUES (
    gen_random_uuid(),
    p_user_id,
    p_market_type,
    p_symbol,
    p_side,
    p_order_type,
    p_quantity,
    p_price,
    'pending',
    p_exchange
  ) RETURNING id INTO v_order_id;

  -- Bakiyeyi güncelle
  UPDATE real_balances 
  SET 
    free_balance = free_balance - v_required_balance,
    locked_balance = locked_balance + v_required_balance,
    last_updated = NOW()
  WHERE user_id = p_user_id 
    AND market_type = p_market_type
    AND exchange = p_exchange;

  RETURN v_order_id;
END;
$$;

-- Gerçek piyasa verisi stored procedure'u
CREATE OR REPLACE FUNCTION get_real_market_data(
  p_market_type VARCHAR,
  p_symbol VARCHAR
) RETURNS TABLE (
  symbol VARCHAR,
  price DECIMAL,
  high24h DECIMAL,
  low24h DECIMAL,
  volume24h DECIMAL,
  change24h DECIMAL,
  bid DECIMAL,
  ask DECIMAL,
  last_update TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    md.symbol,
    md.price,
    md.high_24h,
    md.low_24h,
    md.volume_24h,
    md.change_24h,
    md.bid,
    md.ask,
    md.last_update
  FROM market_data md
  WHERE md.market_type = p_market_type
    AND md.symbol = p_symbol
  ORDER BY md.last_update DESC
  LIMIT 1;
END;
$$;

-- RLS politikası
ALTER FUNCTION execute_trade(UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, DECIMAL, DECIMAL, VARCHAR) 
  SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION execute_trade(UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, DECIMAL, DECIMAL, VARCHAR) 
  TO authenticated;

GRANT EXECUTE ON FUNCTION get_real_market_data(VARCHAR, VARCHAR) 
  TO authenticated;