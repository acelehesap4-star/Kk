import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { checkKK99Balance } from '../middleware/commission';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const tradeSchema = z.object({
  marketType: z.enum(['CRYPTO', 'FOREX', 'STOCKS']),
  symbol: z.string(),
  type: z.enum(['BUY', 'SELL']),
  amount: z.number().positive(),
  price: z.number().positive()
});

// Yeni İşlem Oluşturma
router.post('/create', authenticateToken, checkKK99Balance, async (req, res) => {
  try {
    const { marketType, symbol, type, amount, price } = tradeSchema.parse(req.body);
    const commission = calculateCommission(amount, price);

    const trade = await prisma.trade.create({
      data: {
        userId: req.user.id,
        marketType,
        symbol,
        type,
        amount,
        price,
        commission,
        status: 'PENDING'
      }
    });

    // KK99 komisyonunu düş
    await prisma.user.update({
      where: { id: req.user.id },
      data: { kk99Balance: { decrement: commission } }
    });

    // İşlemi gerçekleştir
    const executedTrade = await executeTradeOrder(trade);

    res.json(executedTrade);
  } catch (error) {
    res.status(400).json({ error: 'İşlem gerçekleştirilemedi' });
  }
});

// Kullanıcının İşlem Geçmişi
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const trades = await prisma.trade.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'İşlem geçmişi alınamadı' });
  }
});

// Açık Emirler
router.get('/orders/open', authenticateToken, async (req, res) => {
  try {
    const openOrders = await prisma.trade.findMany({
      where: { 
        userId: req.user.id,
        status: 'PENDING'
      }
    });

    res.json(openOrders);
  } catch (error) {
    res.status(500).json({ error: 'Açık emirler alınamadı' });
  }
});

// Emir İptali
router.post('/cancel/:tradeId', authenticateToken, async (req, res) => {
  try {
    const { tradeId } = req.params;
    
    const trade = await prisma.trade.findFirst({
      where: {
        id: tradeId,
        userId: req.user.id,
        status: 'PENDING'
      }
    });

    if (!trade) {
      return res.status(404).json({ error: 'Emir bulunamadı' });
    }

    // KK99 komisyonunu iade et
    await prisma.user.update({
      where: { id: req.user.id },
      data: { kk99Balance: { increment: trade.commission } }
    });

    // Emri iptal et
    await prisma.trade.update({
      where: { id: tradeId },
      data: { status: 'FAILED' }
    });

    res.json({ message: 'Emir başarıyla iptal edildi' });
  } catch (error) {
    res.status(500).json({ error: 'Emir iptal edilemedi' });
  }
});

// Yardımcı Fonksiyonlar
function calculateCommission(amount: number, price: number): number {
  const totalValue = amount * price;
  return totalValue * 0.002; // %0.2 komisyon
}

async function executeTradeOrder(trade: any) {
  // Market türüne göre işlem gerçekleştirme
  switch (trade.marketType) {
    case 'CRYPTO':
      return executeCryptoTrade(trade);
    case 'FOREX':
      return executeForexTrade(trade);
    case 'STOCKS':
      return executeStockTrade(trade);
    default:
      throw new Error('Geçersiz market türü');
  }
}

export default router;