// src/app.js
import express from 'express';
import logger from './config/logger.js';

import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router as authRoutes } from './routes/auth.routes.js';

const app = express();
app.use(helmet());
app.use(cors());

// ===== Global Middlewares =====
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));
// ===== Health Check Route =====
app.get('/', (req, res) => {
  logger.info('Health check endpoint accessed'); 
  res.status(200).json({
    status: 'success',
    message: 'Acquisitions API is running 🚀',
  });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
    });
app.get('/api', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the Acquisitions API 🚀'
    });
    });

app.use('/api/auth', authRoutes);

// ===== Example API Route =====
// app.use("/api/v1/users", userRoutes);

// ===== Global Error Handler (basic) =====
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

export default app; // 🔥 IMPORTANT
