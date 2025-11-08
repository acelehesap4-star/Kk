-- Soğuk cüzdan işlemleri için gerekli tabloların oluşturulması
CREATE TABLE IF NOT EXISTS public.cold_wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    network TEXT NOT NULL CHECK (network IN ('BTC', 'ETH', 'BNB', 'TRX', 'USDT')),
    amount DECIMAL(24,8) NOT NULL,
    coin_amount BIGINT NOT NULL,
    tx_hash TEXT UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'completed')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES public.profiles(id),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_cold_wallet_user_id ON public.cold_wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_cold_wallet_status ON public.cold_wallet_transactions(status);
CREATE INDEX IF NOT EXISTS idx_cold_wallet_tx_hash ON public.cold_wallet_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_cold_wallet_created_at ON public.cold_wallet_transactions(created_at DESC);

-- RLS Politikaları
ALTER TABLE public.cold_wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi işlemlerini görebilir
CREATE POLICY "Kullanıcılar kendi soğuk cüzdan işlemlerini görebilir"
    ON public.cold_wallet_transactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Kullanıcılar yeni işlem oluşturabilir
CREATE POLICY "Kullanıcılar yeni soğuk cüzdan işlemi oluşturabilir"
    ON public.cold_wallet_transactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Adminler tüm işlemleri yönetebilir
CREATE POLICY "Adminler tüm soğuk cüzdan işlemlerini yönetebilir"
    ON public.cold_wallet_transactions
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

-- Cold Wallet yapılandırması için sistem ayarları
INSERT INTO public.system_settings (key, value) VALUES
(
    'cold_wallet_settings',
    '{
        "networks": {
            "BTC": {
                "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                "min_amount": 0.001,
                "coin_rate": 1000000
            },
            "ETH": {
                "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                "min_amount": 0.01,
                "coin_rate": 2000000
            },
            "BNB": {
                "address": "bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m",
                "min_amount": 0.1,
                "coin_rate": 3000000
            },
            "TRX": {
                "address": "TJRyWwFs9wTFGZg3JbrVriFbNfCug5tDeC",
                "min_amount": 100,
                "coin_rate": 10000
            },
            "USDT": {
                "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                "min_amount": 10,
                "coin_rate": 100000
            }
        },
        "verification_confirmations": {
            "BTC": 3,
            "ETH": 12,
            "BNB": 15,
            "TRX": 20,
            "USDT": 12
        }
    }'::jsonb
)
ON CONFLICT (key) DO NOTHING;