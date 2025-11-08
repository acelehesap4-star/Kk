import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkKK99Balance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Kullanıcı kimliği bulunamadı' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { kk99Balance: true }
    });

    if (!user || user.kk99Balance <= 0) {
      return res.status(402).json({
        error: 'Yetersiz KK99 bakiyesi',
        message: 'İşlem yapabilmek için KK99 token'ına ihtiyacınız var'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'KK99 bakiyesi kontrol edilemedi' });
  }
};