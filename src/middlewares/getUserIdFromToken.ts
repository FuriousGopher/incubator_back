import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../aplication/jwt-service';
import { usersService } from '../services/usersService';

export const getUserIdFromToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (accessToken) {
    const userId = await jwtService.getUserIdByToken(accessToken);
    const userModel = await usersService.findUserById(userId?.userId.toString());
    req.user = { id: userModel?.id };
  }

  next();
};
