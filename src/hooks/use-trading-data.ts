import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Balance, MarketData, MarketType, Order, Position } from '@/types/real-trading';

export const useMarketData = (marketType: MarketType, exchange: string) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMarketData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('market_data')
        .select('*')
        .eq('market_type', marketType)
        .eq('exchange', exchange);

      if (error) throw error;
      setMarketData(data);
    } catch (error) {
      console.error('Market data fetch error:', error);
      toast.error('Piyasa verileri alınamadı');
    } finally {
      setIsLoading(false);
    }
  }, [marketType, exchange]);

  useEffect(() => {
    fetchMarketData();

    // Gerçek zamanlı veri güncelleme
    const subscription = supabase
      .channel('market_data')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'market_data',
        filter: `market_type=eq.${marketType},exchange=eq.${exchange}`
      }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setMarketData(prev => prev.map(item => 
            item.symbol === payload.new.symbol ? { ...item, ...payload.new } : item
          ));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [marketType, exchange, fetchMarketData]);

  return { marketData, isLoading, refreshMarketData: fetchMarketData };
};

export const useBalances = (userId: string, exchange: string) => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalances = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', userId)
        .eq('exchange', exchange);

      if (error) throw error;
      setBalances(data);
    } catch (error) {
      console.error('Balance fetch error:', error);
      toast.error('Bakiye bilgileri alınamadı');
    } finally {
      setIsLoading(false);
    }
  }, [userId, exchange]);

  useEffect(() => {
    fetchBalances();

    const subscription = supabase
      .channel('balances')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'balances',
        filter: `user_id=eq.${userId},exchange=eq.${exchange}`
      }, () => {
        fetchBalances();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, exchange, fetchBalances]);

  return { balances, isLoading, refreshBalances: fetchBalances };
};

export const useOrders = (userId: string, exchange: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .eq('exchange', exchange)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data);
    } catch (error) {
      console.error('Orders fetch error:', error);
      toast.error('İşlem geçmişi alınamadı');
    } finally {
      setIsLoading(false);
    }
  }, [userId, exchange]);

  useEffect(() => {
    fetchOrders();

    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${userId},exchange=eq.${exchange}`
      }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, exchange, fetchOrders]);

  return { orders, isLoading, refreshOrders: fetchOrders };
};

export const usePositions = (userId: string, exchange: string) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPositions = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('user_id', userId)
        .eq('exchange', exchange);

      if (error) throw error;
      setPositions(data);
    } catch (error) {
      console.error('Positions fetch error:', error);
      toast.error('Pozisyon bilgileri alınamadı');
    } finally {
      setIsLoading(false);
    }
  }, [userId, exchange]);

  useEffect(() => {
    fetchPositions();

    const subscription = supabase
      .channel('positions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'positions',
        filter: `user_id=eq.${userId},exchange=eq.${exchange}`
      }, () => {
        fetchPositions();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, exchange, fetchPositions]);

  const closePosition = async (positionId: number) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('positions')
        .delete()
        .eq('id', positionId)
        .eq('user_id', userId);

      if (error) throw error;
      toast.success('Pozisyon başarıyla kapatıldı');
      await fetchPositions();
    } catch (error) {
      console.error('Position close error:', error);
      toast.error('Pozisyon kapatılamadı');
    } finally {
      setIsLoading(false);
    }
  };

  return { positions, isLoading, refreshPositions: fetchPositions, closePosition };
};