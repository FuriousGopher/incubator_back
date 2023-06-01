import mongoose from 'mongoose';
import { DevicesDBModel } from '../models/DevicesType';

const deviceDBModel = new mongoose.Schema<DevicesDBModel>({
  id: { type: String, required: true },
  ip: { type: String, required: true },
  title: { type: String, required: true },
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  lastActiveDate: { type: String, required: true },
  expirationDate: { type: Number, required: true },
});

export const DevicesMongooseModel = mongoose.model('device', deviceDBModel);
