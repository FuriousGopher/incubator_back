import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../aplication/jwt-service';

export const validatorForRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  if (!cookieRefreshToken) {
    res.sendStatus(401);
    return;
  }

  const checkRefreshToken = jwtService.getUserIdByToken(cookieRefreshToken);
  if (!checkRefreshToken) {
    res.sendStatus(401);
    return;
  }

  next();
};
