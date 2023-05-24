import { Request, Response } from 'express';
import { jwtService } from '../aplication/jwt-service';
import { deviceService } from '../services/deviceService';
import { HttpStatusCode } from '../types/HTTP-Response';

export const getAllDevices = async (req: Request, res: Response) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  const checkRefreshToken = await jwtService.getUserIdByToken(cookieRefreshToken);
  if (checkRefreshToken) {
    const userId = checkRefreshToken.userId.toString();
    const foundDevices = await deviceService.foundDevices(userId);
    res.status(HttpStatusCode.OK).send(foundDevices);
  } else {
    res.sendStatus(HttpStatusCode.NotFound);
  }
};

export const deleteSessionById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const isDeleted = await deviceService.deleteDevice(id);
  if (isDeleted) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
};

export const deleteAllDevices = async (req: Request, res: Response) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  const checkRefreshToken = await jwtService.getUserIdByToken(cookieRefreshToken);
  if (checkRefreshToken) {
    const usingDevice = checkRefreshToken.deviceId;
    await deviceService.deleteAllOldDevices(usingDevice);
    res.sendStatus(204);
  } else {
    res.sendStatus(401);
  }
};
