import express from 'express';
import { signup, signIn, signOut } from '#controllers/auth.controller.js';

const router = express.Router();

// Health-check style endpoint so hitting this URL in a browser (GET)
// returns a friendly message instead of "Cannot GET /api/auth/sign-in".
router.get('/sign-in', (req, res) => {
  res.status(200).json({
    message: 'Sign-in endpoint is up. Use POST /api/auth/sign-in with credentials to sign in.',
  });
});

router.post('/sign-up', signup);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);

export { router };
