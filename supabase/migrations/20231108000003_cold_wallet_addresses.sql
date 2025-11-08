-- Soğuk cüzdan ayarlarını güncelle
INSERT INTO system_settings (key, value) 
VALUES ('cold_wallet_settings', jsonb_build_object(
  'networks', jsonb_build_object(
    'ETH', jsonb_build_object(
      'address', '0x163c9a2fa9eaf8ebc5bb5b8f8e916eb8f24230a1',
      'min_amount', 0.01,
      'coin_rate', 10000
    ),
    'SOL', jsonb_build_object(
      'address', 'Gp4itYBqqkNRNYtC22QAPdThPB6Kzx8M1yy2rpXBGxbc',
      'min_amount', 1,
      'coin_rate', 1000
    ),
    'TRX', jsonb_build_object(
      'address', 'THbevzbdxMmUNaN3XFWPkaJe8oSq2C2739',
      'min_amount', 100,
      'coin_rate', 100
    ),
    'BTC', jsonb_build_object(
      'address', 'bc1pzmdep9lzgzswy0nmepvwmexj286kufcfwjfy4fd6dwuedzltntxse9xmz8',
      'min_amount', 0.001,
      'coin_rate', 100000
    )
  ),
  'verification_confirmations', jsonb_build_object(
    'ETH', 12,
    'SOL', 32,
    'TRX', 20,
    'BTC', 6
  )
))
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;