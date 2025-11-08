-- Coin sistemi için gerekli tabloların oluşturulması
-- profiles tablosuna coin bakiyesi ekleme
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coin_balance BIGINT DEFAULT 0;

-- Coin işlem geçmişi tablosu
CREATE TABLE IF NOT EXISTS public.coin_distribution_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('credit', 'debit')) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_by UUID REFERENCES public.profiles(id),
    tx_hash TEXT,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed'))
);

-- Coin sistemi ayarları tablosu
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_coin_dist_user_id ON public.coin_distribution_history(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_dist_created_at ON public.coin_distribution_history(created_at DESC);

-- RLS Politikaları
ALTER TABLE public.coin_distribution_history ENABLE ROW LEVEL SECURITY;

-- Varsayılan ayarları ekle
INSERT INTO public.system_settings (key, value) VALUES
('coin_settings', '{"total_supply": 100000000000000, "initial_distribution": 0, "distribution_rate": 0}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Coin dağıtım geçmişi için politikalar
CREATE POLICY "Kullanıcılar kendi işlemlerini görebilir"
    ON public.coin_distribution_history
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Adminler tüm işlemleri görebilir"
    ON public.coin_distribution_history
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

-- System settings için politikalar
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes ayarları okuyabilir"
    ON public.system_settings
    FOR SELECT
    USING (true);

CREATE POLICY "Sadece adminler ayarları değiştirebilir"
    ON public.system_settings
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));