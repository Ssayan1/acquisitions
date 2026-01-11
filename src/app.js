// src/app.js
import express from 'express';

const app = express();

// ===== Global Middlewares =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Health Check Route =====
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Acquisitions API is running 🚀',
  });
});

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
