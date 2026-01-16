import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';

const DEFAULT_JWT_SECRET = 'your-secret-key-please-change-in-production';
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
const JWT_EXPIRES_IN = '1d';

if (
  JWT_SECRET === DEFAULT_JWT_SECRET &&
  process.env.NODE_ENV !== 'development'
) {
  logger.warn(
    'Using default JWT secret outside development. Please set JWT_SECRET in environment variables.'
  );
}

export const jwttoken = {
  sign: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (e) {
      logger.error('Failed to sign JWT token', e);
      throw new Error('Failed to sign token');
    }
  },
  verify: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      logger.error('Failed to verify JWT token', e);
      throw new Error('Failed to authenticate token');
    }
  },
};
