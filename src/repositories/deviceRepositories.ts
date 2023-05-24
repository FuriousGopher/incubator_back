import { userDevicesCollection } from '../models/dbCollections';
import { DevicesType } from '../models/DevicesType';

export const deviceRepositories = {
  async createDevice(newDevice: DevicesType) {
    await userDevicesCollection.insertOne({ ...newDevice });
    return newDevice;
  },
  async findDeviceById(deviceId: string) {
    const foundDevice = await userDevicesCollection.findOne({ deviceId });

    if (!foundDevice) {
      return null;
    }

    return foundDevice;
  },

  async findAllDevicesById(userId: string) {
    return userDevicesCollection.find({ userId }, { projection: { _id: 0, ip: 1, title: 1, lastActiveDate: 1, deviceId: 1 } }).toArray();
  },
  async updateDevice(userId: string, issuedAt: number) {
    const result = await userDevicesCollection.updateOne({ userId }, { $set: { lastActiveDate: issuedAt } });
    return result.matchedCount === 1;
  },
  async deleteDevice(deviceId: string) {
    const result = await userDevicesCollection.deleteOne({ deviceId });
    return result.deletedCount === 1;
  },

  async deleteAllOldDevices(currentDevice: string) {
    await userDevicesCollection.deleteMany({ deviceId: { $ne: currentDevice } });
    return (await userDevicesCollection.countDocuments()) === 1;
  },
};
