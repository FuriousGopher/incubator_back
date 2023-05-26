import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../aplication/jwt-service';
import { authService } from '../services/authService';

const REFRESH_TOKEN = 'refreshToken';

export const validatorForRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieRefreshToken = req.cookies[REFRESH_TOKEN];
    if (!cookieRefreshToken) return res.sendStatus(401);

    const userId = await jwtService.getUserIdByToken(cookieRefreshToken);
    if (!userId) return res.sendStatus(401);
    const user = await authService.findUserById(userId.userId.toString());
    if (!user) return res.sendStatus(401);

    req.user = user;
    req.deviceId = userId.deviceId;
    return next();
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
