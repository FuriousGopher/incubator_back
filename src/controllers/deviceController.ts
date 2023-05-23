import { deviceService } from '../services/deviceService';

export const createDeviceList = async (newRefreshToken: string, ip: string, userAgent: string) => {
  const newDeviceList = await deviceService.createDeviceList(newRefreshToken, ip, userAgent);
  return newDeviceList;
};
