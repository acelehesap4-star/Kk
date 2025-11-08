import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(403).json({ error: 'Geçersiz token' });
  }
};

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Yetkisiz erişim' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Geçersiz token' });
  }
};