import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../types/HTTP-Response';
import { jwtService } from '../aplication/jwt-service';
import { usersService } from '../services/usersService';

export const checkTokenAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.send(HttpStatusCode.Unauthorized);
    return;
  }
  const token = req.headers.authorization.split(' ')[1];
  const userId = await jwtService.getUserIdByToken(token);
  if (userId) {
    const userModel = await usersService.findUserById(userId);
    if (!userModel) {
      return res.send(HttpStatusCode.Unauthorized);
    }
    req.user = { id: userModel.id };
    next();
    return;
  }
  res.send(HttpStatusCode.Unauthorized);
};