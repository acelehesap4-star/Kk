import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateAdmin } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Dashboard İstatistikleri
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const [
      userCount,
      totalTrades,
      totalVolume,
      kk99Usage
    ] = await Promise.all([
      prisma.user.count(),
      prisma.trade.count(),
      prisma.trade.aggregate({
        _sum: {
          amount: true,
          commission: true
        }
      }),
      prisma.user.aggregate({
        _sum: {
          kk99Balance: true
        }
      })
    ]);

    res.json({
      userCount,
      totalTrades,
      totalVolume: totalVolume._sum.amount || 0,
      totalCommission: totalVolume._sum.commission || 0,
      kk99InCirculation: kk99Usage._sum.kk99Balance || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'İstatistikler alınamadı' });
  }
});

// Kullanıcı Yönetimi
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        wallets: true,
        trades: {
          select: {
            id: true,
            marketType: true,
            type: true,
            amount: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcı listesi alınamadı' });
  }
});

// Kullanıcı Detayı
router.get('/users/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallets: true,
        trades: true,
        deposits: true,
        withdrawals: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcı detayları alınamadı' });
  }
});

// Kullanıcı Durumu Güncelleme
router.patch('/users/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcı güncellenemedi' });
  }
});

// İşlem Yönetimi
router.get('/trades', authenticateAdmin, async (req, res) => {
  try {
    const trades = await prisma.trade.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'İşlem listesi alınamadı' });
  }
});

// Para Yatırma/Çekme İşlemleri
router.get('/transactions', authenticateAdmin, async (req, res) => {
  try {
    const [deposits, withdrawals] = await Promise.all([
      prisma.deposit.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.withdrawal.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    res.json({ deposits, withdrawals });
  } catch (error) {
    res.status(500).json({ error: 'İşlem listesi alınamadı' });
  }
});

// Para Yatırma Onayı
router.post('/transactions/deposit/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deposit = await prisma.deposit.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });

    // Kullanıcı bakiyesini güncelle
    await updateUserBalance(deposit.userId, deposit.amount, deposit.currency);

    res.json({ message: 'Para yatırma işlemi onaylandı' });
  } catch (error) {
    res.status(500).json({ error: 'İşlem onaylanamadı' });
  }
});

// Para Çekme Onayı
router.post('/transactions/withdrawal/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { txHash } = req.body;

    const withdrawal = await prisma.withdrawal.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        txHash
      }
    });

    res.json({ message: 'Para çekme işlemi onaylandı' });
  } catch (error) {
    res.status(500).json({ error: 'İşlem onaylanamadı' });
  }
});

// Sistem Metrikleri
router.get('/metrics', authenticateAdmin, async (req, res) => {
  try {
    const [
      dailyTrades,
      dailyVolume,
      newUsers,
      activeUsers
    ] = await Promise.all([
      getDailyTradeMetrics(),
      getDailyVolumeMetrics(),
      getNewUserMetrics(),
      getActiveUserMetrics()
    ]);

    res.json({
      dailyTrades,
      dailyVolume,
      newUsers,
      activeUsers
    });
  } catch (error) {
    res.status(500).json({ error: 'Metrikler alınamadı' });
  }
});

// Yardımcı Fonksiyonlar
async function updateUserBalance(userId: string, amount: number, currency: string) {
  const wallet = await prisma.wallet.findFirst({
    where: {
      userId,
      type: getWalletType(currency)
    }
  });

  if (wallet) {
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } }
    });
  }
}

function getWalletType(currency: string): 'CRYPTO' | 'FOREX' | 'STOCKS' {
  if (['BTC', 'ETH', 'SOL', 'TRX', 'KK99'].includes(currency)) {
    return 'CRYPTO';
  }
  if (['EUR', 'USD', 'GBP', 'JPY'].includes(currency)) {
    return 'FOREX';
  }
  return 'STOCKS';
}

async function getDailyTradeMetrics() {
  // Son 30 günlük işlem metrikleri
  return prisma.trade.groupBy({
    by: ['createdAt'],
    _count: true,
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }
  });
}

async function getDailyVolumeMetrics() {
  // Son 30 günlük hacim metrikleri
  return prisma.trade.groupBy({
    by: ['createdAt'],
    _sum: {
      amount: true
    },
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }
  });
}

async function getNewUserMetrics() {
  // Son 30 günlük yeni kullanıcı metrikleri
  return prisma.user.groupBy({
    by: ['createdAt'],
    _count: true,
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }
  });
}

async function getActiveUserMetrics() {
  // Son 30 günlük aktif kullanıcı metrikleri
  return prisma.trade.groupBy({
    by: ['userId'],
    _count: true,
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }
  });
}

export default router;