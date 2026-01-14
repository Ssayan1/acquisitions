import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
import logger from '#config/logger.js';

const authMiddleware = (req, res, next) => {
  const token = cookies.get(req, 'token');

  if (!token) {
    logger.warn('Missing auth token', { path: req.path, method: req.method, ip: req.ip });
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication token is required' });
  }

  try {
    const payload = jwttoken.verify(token);

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role || 'user',
    };

    return next();
  } catch (e) {
    logger.warn('Invalid auth token', {
      error: e,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });

    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
