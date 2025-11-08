import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = registerSchema;

// Kullanıcı Kaydı
router.post('/register', async (req, res) => {
  try {
    const { email, password } = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Bu email adresi zaten kayıtlı' });
    }

    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        wallets: {
          create: [
            { type: 'CRYPTO', address: '', balance: 0 },
            { type: 'FOREX', address: '', balance: 0 },
            { type: 'STOCKS', address: '', balance: 0 }
          ]
        }
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Kayıt işlemi başarısız' });
  }
});

// Kullanıcı Girişi
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Geçersiz kimlik bilgileri' });
    }

    const validPassword = await compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Geçersiz kimlik bilgileri' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: 'Giriş başarısız' });
  }
});

// Admin Girişi
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Yetkisiz erişim' });
    }

    const validPassword = await compare(password, process.env.ADMIN_PASSWORD_HASH!);
    if (!validPassword) {
      return res.status(401).json({ error: 'Yetkisiz erişim' });
    }

    const token = jwt.sign(
      { userId: 'admin', email, role: 'ADMIN' },
      process.env.JWT_SECRET!,
      { expiresIn: '12h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: 'Yetkisiz erişim' });
  }
});

export default router;