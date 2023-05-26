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
      title: userAgent,
      userId: getUser.userId.toString(),
      deviceId: getUser.deviceId,
      lastActiveDate: getUser.iat.toString(),
      expirationDate: getUser.exp,
    };

    return deviceRepositories.createDevice(newDevice);
  },

  async updateDevice(userId: string, issuedAt: number) {
    return deviceRepositories.updateDevice(userId, issuedAt);
  },

  async foundDeviceById(deviceId: string) {
    return deviceRepositories.findDeviceById(deviceId);
  },

  async foundDevices(userId: string) {
    return deviceRepositories.findAllDevicesById(userId);
  },

  async deleteDevice(deviceId: string) {
    return deviceRepositories.deleteDevice(deviceId);
  },

  async deleteAllOldDevices(currentDevice: string) {
    return deviceRepositories.deleteAllOldDevices(currentDevice);
  },
};
