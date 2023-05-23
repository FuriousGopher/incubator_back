import { jwtService } from '../aplication/jwt-service';
import { uuid } from 'uuidv4';
import { DevicesType } from '../models/DevicesType';
import { deviceRepositories } from '../repositories/deviceRepositories';

export const deviceService = {
  async createDeviceList(newRefreshToken: string, ip: string, userAgent: string) {
    const getUser = await jwtService.getUserIdByToken(newRefreshToken);
    if (!getUser) {
      return null;
    }

    const newDevice: DevicesType = {
      id: uuid(),
      ip: ip,
      deviceName: userAgent,
      userId: getUser.userId.toString(),
      deviceId: getUser.deviceId,
      lastActiveDate: getUser.iat,
      expirationDate: getUser.exp,
    };
    console.log(newDevice);

    return deviceRepositories.createDevice(newDevice);
  },
};
