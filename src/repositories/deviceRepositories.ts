import { DevicesType } from '../models/DevicesType';
import { DevicesMongooseModel } from '../Domain/DeviceSchema';

export const deviceRepositories = {
  async createDevice(newDevice: DevicesType) {
    await DevicesMongooseModel.create({ ...newDevice });
    return newDevice;
  },
  async findDeviceById(deviceId: string) {
    const foundDevice = await DevicesMongooseModel.findOne({ deviceId });

    if (!foundDevice) {
      return null;
    }

    return foundDevice;
  },

  async findAllDevicesById(userId: string) {
    const devices = await DevicesMongooseModel.find({ userId }, { projection: { _id: 0, deviceId: 1, ip: 1, lastActiveDate: 1, title: 1 } }).lean();

    return devices.map((device) => ({
      deviceId: device.id,
      ip: device.ip,
      lastActiveDate: device.lastActiveDate,
      title: device.title,
    }));
  },
  async updateDevice(userId: string, deviceId: string, issuedAt: string) {
    const result = await DevicesMongooseModel.updateOne({ userId, deviceId }, { $set: { lastActiveDate: issuedAt } });
    return result.modifiedCount === 1;
  },
  async deleteDevice(deviceId: string) {
    const result = await DevicesMongooseModel.deleteOne({ deviceId });
    return result.deletedCount === 1;
  },

  async deleteAllOldDevices(currentDevice: string) {
    await DevicesMongooseModel.deleteMany({ deviceId: { $ne: currentDevice } });
    return (await DevicesMongooseModel.countDocuments()) === 1;
  },
};
