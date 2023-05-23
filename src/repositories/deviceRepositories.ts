import { userDevicesCollection } from '../models/dbCollections';
import { DevicesType } from '../models/DevicesType';

export const deviceRepositories = {
  async createDevice(newDevice: DevicesType) {
    await userDevicesCollection.insertOne({ ...newDevice });
    return newDevice;
  },
};
