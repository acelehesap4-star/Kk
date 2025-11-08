import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import TronWeb from 'tronweb';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const depositSchema = z.object({
  amount: z.number().positive(),
  currency: z.string(),
  txHash: z.string()
});

const withdrawSchema = z.object({
  amount: z.number().positive(),
  currency: z.string(),
  address: z.string()
});

// Cüzdan Bakiyeleri
router.get('/balances', authenticateToken, async (req, res) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: { userId: req.user.id }
    });

    const kk99Balance = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { kk99Balance: true }
    });

    res.json({
      wallets,
      kk99Balance: kk99Balance?.kk99Balance || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Bakiye bilgileri alınamadı' });
  }
});

// Para Yatırma
router.post('/deposit', authenticateToken, async (req, res) => {
  try {
    const { amount, currency, txHash } = depositSchema.parse(req.body);

    // İşlem hash'ini kontrol et
    const verified = await verifyTransaction(currency, txHash);
    if (!verified) {
      return res.status(400).json({ error: 'Geçersiz işlem' });
    }

    const deposit = await prisma.deposit.create({
      data: {
        userId: req.user.id,
        amount,
        currency,
        txHash,
        status: 'PENDING'
      }
    });

    // İşlemi onayla ve bakiyeyi güncelle
    await processDeposit(deposit);

    res.json({ message: 'Para yatırma işlemi başarılı' });
  } catch (error) {
    res.status(400).json({ error: 'Para yatırma işlemi başarısız' });
  }
});

// Para Çekme
router.post('/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount, currency, address } = withdrawSchema.parse(req.body);

    // Bakiye kontrolü
    const wallet = await prisma.wallet.findFirst({
      where: {
        userId: req.user.id,
        type: getWalletType(currency)
      }
    });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Yetersiz bakiye' });
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: req.user.id,
        amount,
        currency,
        address,
        status: 'PENDING'
      }
    });

    // Para çekme işlemini başlat
    await processWithdrawal(withdrawal);

    res.json({ message: 'Para çekme işlemi başlatıldı' });
  } catch (error) {
    res.status(400).json({ error: 'Para çekme işlemi başarısız' });
  }
});

// İşlem Geçmişi
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const [deposits, withdrawals] = await Promise.all([
      prisma.deposit.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.withdrawal.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({ deposits, withdrawals });
  } catch (error) {
    res.status(500).json({ error: 'İşlem geçmişi alınamadı' });
  }
});

// Yardımcı Fonksiyonlar
function getWalletType(currency: string): 'CRYPTO' | 'FOREX' | 'STOCKS' {
  if (['BTC', 'ETH', 'SOL', 'TRX', 'KK99'].includes(currency)) {
    return 'CRYPTO';
  }
  if (['EUR', 'USD', 'GBP', 'JPY'].includes(currency)) {
    return 'FOREX';
  }
  return 'STOCKS';
}

async function verifyTransaction(currency: string, txHash: string): Promise<boolean> {
  switch (currency) {
    case 'ETH':
      return verifyEthereumTransaction(txHash);
    case 'SOL':
      return verifySolanaTransaction(txHash);
    case 'TRX':
      return verifyTronTransaction(txHash);
    default:
      throw new Error('Desteklenmeyen para birimi');
  }
}

async function processDeposit(deposit: any) {
  const wallet = await prisma.wallet.findFirst({
    where: {
      userId: deposit.userId,
      type: getWalletType(deposit.currency)
    }
  });

  if (wallet) {
    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: deposit.amount } }
      }),
      prisma.deposit.update({
        where: { id: deposit.id },
        data: { status: 'COMPLETED' }
      })
    ]);
  }
}

async function processWithdrawal(withdrawal: any) {
  const wallet = await prisma.wallet.findFirst({
    where: {
      userId: withdrawal.userId,
      type: getWalletType(withdrawal.currency)
    }
  });

  if (wallet) {
    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: withdrawal.amount } }
      }),
      prisma.withdrawal.update({
        where: { id: withdrawal.id },
        data: { status: 'COMPLETED' }
      })
    ]);
  }
}

export default router;