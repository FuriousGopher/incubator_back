import { Request, Response } from 'express';
import { jwtService } from '../aplication/jwt-service';
import { deviceService } from '../services/deviceService';
import { HttpStatusCode } from '../types/HTTP-Response';
import { postsService } from '../services/postsService';

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
  const cookieRefreshToken = req.cookies.refreshToken;
  const checkRefreshToken = await jwtService.getUserIdByToken(cookieRefreshToken);
  const id = req.params.id;
  const isDeleted = await deviceService.deleteDevice(id);
  if (isDeleted) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
};
