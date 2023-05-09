import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../aplication/jwt-service';
import { authService } from '../services/authService';

const REFRESH_TOKEN = 'refreshToken';

export const validatorForRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieRefreshToken = req.cookies[REFRESH_TOKEN];
    const userId = await jwtService.getUserIdByToken(cookieRefreshToken);

    if (userId) {
      const user = await authService.findUserById(userId);
      if (user?.securityData.refreshToken === cookieRefreshToken) {
        return next();
      }
    }

    return res.sendStatus(401);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
