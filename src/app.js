// src/app.js
import express from 'express';
import logger from './config/logger.js';

import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router as authRoutes } from './routes/auth.routes.js';
import securityMiddleware from '#middleware/security.middleware.js';

const app = express();

// ===== Security & CORS =====
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// ===== Global Middlewares =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  morgan('combined', {
    stream: {
      write: message => logger.info(message.trim()),
    },
  })
);
app.use(securityMiddleware);

// ===== Health & Info Routes =====
app.get('/', (req, res) => {
  logger.info('Health check endpoint accessed', { path: req.path, method: req.method });
  res.status(200).json({
    status: 'success',
    message: 'Acquisitions API is running',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Acquisitions API',
  });
});

// Health-check style endpoint so hitting this URL in a browser (GET)
// returns a friendly message instead of "Cannot GET /api/auth/sign-in".
app.get('/api/auth/sign-in', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Sign-in endpoint is up. Use POST /api/auth/sign-in with credentials to sign in.',
  });
});

// ===== API Routes =====
app.use('/api/auth', authRoutes);

// ===== Global Error Handler =====
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;

  logger.error('Unhandled error', {
    error: err,
    path: req.path,
    method: req.method,
    status,
  });

  res.status(status).json({
    status: 'error',
    message: status === 500 ? 'Internal server error' : err.message,
  });
});

export default app; // 🔥 IMPORTANT
