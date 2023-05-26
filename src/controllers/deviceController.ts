import { Request, Response } from 'express';
import { jwtService } from '../aplication/jwt-service';
import { deviceService } from '../services/deviceService';
import { HttpStatusCode } from '../types/HTTP-Response';

export const getAllDevices = async (req: Request, res: Response) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  const deviceId = req.deviceId!;
  const userId = req.user!.id;
  const lastActiveDate = await jwtService.lastActiveDate(cookieRefreshToken);
  const device = await deviceService.foundDeviceById(deviceId);
  if (!device) return res.sendStatus(HttpStatusCode.Unauthorized);
  if (device.lastActiveDate !== lastActiveDate) return res.sendStatus(HttpStatusCode.Unauthorized);
  if (device.userId !== userId) return res.sendStatus(HttpStatusCode.Forbidden);
  const foundDevices = await deviceService.foundDevices(userId);
  return res.send(foundDevices);
};

export const deleteSessionById = async (req: Request, res: Response) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  const toDeleteId = req.params.id;
  const deviceId = req.deviceId!;
  const userId = req.user!.id;
  const lastActiveDate = await jwtService.lastActiveDate(cookieRefreshToken);
  const toDeleteDevice = deviceService.foundDeviceById(toDeleteId);
  if (!toDeleteDevice) return res.sendStatus(HttpStatusCode.NotFound);
  const device = await deviceService.foundDeviceById(deviceId);
  if (!device) return res.sendStatus(HttpStatusCode.NotFound);
  if (device.lastActiveDate !== lastActiveDate) return res.sendStatus(HttpStatusCode.Unauthorized); /// i change this one
  if (device.userId !== userId) return res.sendStatus(HttpStatusCode.Forbidden);
  await deviceService.deleteDevice(toDeleteId);
  return res.sendStatus(HttpStatusCode.NoContent);
};

export const deleteAllDevices = async (req: Request, res: Response) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  const deviceId = req.deviceId!;
  const userId = req.user!.id;
  const lastActiveDate = await jwtService.lastActiveDate(cookieRefreshToken);
  const device = await deviceService.foundDeviceById(deviceId);
  if (!device) return res.sendStatus(HttpStatusCode.NotFound);
  if (device.lastActiveDate !== lastActiveDate) return res.sendStatus(HttpStatusCode.Unauthorized);
  if (device.userId !== userId) return res.sendStatus(HttpStatusCode.Forbidden);
  const checkRefreshToken = await jwtService.getUserIdByToken(cookieRefreshToken);
  if (checkRefreshToken) {
    const usingDevice = checkRefreshToken.deviceId;
    await deviceService.deleteAllOldDevices(usingDevice);
    res.sendStatus(204);
  } else {
    res.sendStatus(401);
  }
};
