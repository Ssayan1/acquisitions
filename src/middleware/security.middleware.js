import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    // Default limit in case role is unexpected
    let limit = 5;

    switch (role) {
      case 'admin':
        limit = 20;
        break;
      case 'user':
        limit = 10;
        break;
      case 'guest':
        limit = 5;
        break;
      default:
        logger.warn('Unknown role for rate limiting, using guest defaults', { role });
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);

    // Debug log for visibility into Arcjet decisions (non-blocking)
    logger.debug?.('Arcjet decision', {
      path: req.path,
      method: req.method,
      ip: req.ip,
      role,
      allowed: decision.isAllowed(),
      denied: decision.isDenied(),
    });

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield blocked request', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by security policy',
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Too many requests',
      });
    }

    return next();
  } catch (e) {
    logger.error('Arcjet middleware error', {
      error: e,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong with security middleware',
    });
  }
};

export default securityMiddleware;
