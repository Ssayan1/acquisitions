import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
import logger from '#config/logger.js';

export const authenticateToken = (req, res, next) => {
  const token = cookies.get(req, 'token');

  if (!token) {
    logger.warn('Missing auth token', {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token is required',
    });
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

    return res
      .status(401)
      .json({ error: 'Unauthorized', message: 'Invalid or expired token' });
  }
};

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: 'Unauthorized', message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Insufficient permissions', {
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        path: req.path,
        ip: req.ip,
      });

      return res
        .status(403)
        .json({ error: 'Forbidden', message: 'Insufficient permissions' });
    }

    return next();
  };
};

const authMiddleware = authenticateToken;
export default authMiddleware;
