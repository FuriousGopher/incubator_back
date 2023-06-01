import mongoose from 'mongoose';
import { LogsDBModel } from '../models/logsType';

const logsSchema = new mongoose.Schema<LogsDBModel>({
  ip: { type: String, required: true },
  endpoint: { type: String, required: true },
  firstAttempt: { type: String, required: true },
  lastAttempt: { type: String, required: true },
  attemptsCount: { type: String, required: true },
});

export const LogsMongooseModel = mongoose.model('logs', logsSchema);
