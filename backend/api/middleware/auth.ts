import { Request, Response, NextFunction, RequestHandler } from 'express';
import User from '../models/user';
import { IApiResponse } from '../types';
import { IUser } from '../interfaces/user.interface';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Rate limiting middleware for authentication endpoints
 * Prevents brute force attacks on login/register endpoints
 */
export const authRateLimit = (() => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  const MAX_ATTEMPTS = 5;
  const RESET_TIME = 15 * 60 * 1000; // 15 minutes

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    // Clean up old entries
    for (const [ip, data] of attempts.entries()) {
      if (now > data.resetTime) {
        attempts.delete(ip);
      }
    }

    const clientAttempts = attempts.get(clientIP);

    if (clientAttempts && clientAttempts.count >= MAX_ATTEMPTS) {
      const timeLeft = Math.ceil((clientAttempts.resetTime - now) / 1000 / 60);
      const response: IApiResponse = {
        success: false,
        message: `Too many authentication attempts. Try again in ${timeLeft} minutes.`
      };
      res.status(429).json(response);
      return;
    }

    // Increment attempts
    if (clientAttempts) {
      clientAttempts.count++;
    } else {
      attempts.set(clientIP, {
        count: 1,
        resetTime: now + RESET_TIME
      });
    }

    next();
  };
})();

export const logAuth: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (process.env.NODE_ENV === 'development') {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(`🔐 Auth attempt: ${req.method} ${req.path} - Token: ${token ? 'Present' : 'Missing'}`);
  }
  next();
};
