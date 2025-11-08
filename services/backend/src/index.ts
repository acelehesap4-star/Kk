import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import { config } from 'dotenv';
import { ethers } from 'ethers';
import { Connection } from '@solana/web3.js';
import TronWeb from 'tronweb';
import Web3 from 'web3';
import winston from 'winston';

// Environment variables
config();

// Database clients
const prisma = new PrismaClient();
const redis = createClient({
  url: process.env.REDIS_URL
});

// Blockchain connections
const ethereumProvider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
const solanaConnection = new Connection(process.env.SOLANA_RPC_URL);
const tronWeb = new TronWeb({
  fullHost: process.env.TRON_RPC_URL
});
const web3 = new Web3(process.env.ETH_RPC_URL);

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Express app setup
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Routes
import authRoutes from './routes/auth';
import marketRoutes from './routes/markets';
import tradeRoutes from './routes/trades';
import walletRoutes from './routes/wallets';
import adminRoutes from './routes/admin';

app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/admin', adminRoutes);

// WebSocket events
io.on('connection', (socket) => {
  logger.info('Client connected:', socket.id);

  // Market data subscription
  socket.on('subscribe', async (markets) => {
    for (const market of markets) {
      socket.join(market);
      // Start sending real-time market data
      startMarketDataFeed(market, socket);
    }
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});