import { NextFunction, Request, Response } from 'express';
import { logsService } from '../services/logsService';

export const logsLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  const endpoint = req.originalUrl;

  const foundRateLimit = await logsService.findLogsLimit(ip, endpoint);

  if (!foundRateLimit) {
    await logsService.createLogsLimit(ip, endpoint);
  } else {
    const diffBetweenNowAndFirst = Date.now() - foundRateLimit.firstAttempt;
    const diffBetweenNowAndLast = Date.now() - foundRateLimit.lastAttempt;

    if (foundRateLimit.attemptsCount >= 5) {
      if (diffBetweenNowAndLast < 5000) {
        res.sendStatus(429);
        return;
      } else {
        await logsService.deleteRateLimit(ip, endpoint);
      }
    }

    if (diffBetweenNowAndFirst < 10000) {
      await logsService.updateCounter(ip, endpoint, Date.now());
    } else {
      await logsService.deleteRateLimit(ip, endpoint);
      await logsService.createLogsLimit(ip, endpoint);
    }
  }

  next();
};
