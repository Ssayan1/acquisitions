import express from 'express';
import { signup, signIn, signOut } from '#controllers/auth.controller.js';
import authMiddleware from '#middleware/auth.middleware.js';

const router = express.Router();

router.post('/sign-up', signup);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);

// Authenticated route to get current user from JWT cookie
router.get('/me', authMiddleware, (req, res) => {
  const { id, email, role } = req.user || {};

  if (!id || !email) {
    return res.status(401).json({ error: 'Unauthorized', message: 'User not found in token' });
  }

  res.status(200).json({
    id,
    email,
    role,
  });
});

export { router };
