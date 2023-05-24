import { jwtService } from '../aplication/jwt-service';
import { NextFunction, Request, Response } from 'express';
import { deviceService } from '../services/deviceService';
import { HttpStatusCode } from '../types/HTTP-Response';

export const deleteDeviceOwnValidator = async (req: Request, res: Response, next: NextFunction) => {
  const cookieRefreshToken = req.cookies.refreshToken;

  if (!cookieRefreshToken) {
    res.sendStatus(401);
    return;
  }

  const userIdByToken = await jwtService.getUserIdByToken(cookieRefreshToken);

  if (!userIdByToken) {
    res.sendStatus(401);
    return;
  }

  const deviceId = req.params.id;
  const device = await deviceService.foundDeviceById(deviceId);
  if (device) {
    const deviceUserId = device?.userId;
    const cookieUserId = userIdByToken.userId.toString();

    if (deviceUserId !== cookieUserId) {
      res.sendStatus(HttpStatusCode.Forbidden);
      return;
    }
  } else {
    res.sendStatus(HttpStatusCode.NotFound);
  }

  next();
};
