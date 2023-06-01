import { LogsDBModel, LogsType } from '../models/logsType';
import { LogsMongooseModel } from '../Domain/LogsSchema';

export const logsRepositories = {
  async findLogsLimit(ip: string, endpoint: string): Promise<LogsDBModel | null> {
    const foundRateLimit = await LogsMongooseModel.findOne({ ip, endpoint });

    if (!foundRateLimit) {
      return null;
    }

    return foundRateLimit;
  },

  async createLogsLimit(rateLimit: LogsType): Promise<LogsType> {
    await LogsMongooseModel.create({ ...rateLimit });
    return rateLimit;
  },

  async updateCounter(ip: string, endpoint: string, attemptsCount: number, currentDate: number): Promise<boolean> {
    const result = await LogsMongooseModel.updateOne(
      { ip, endpoint },
      {
        $set: { attemptsCount, lastAttempt: currentDate },
      },
    );
    return result.matchedCount === 1;
  },

  async deleteRateLimit(ip: string, endpoint: string): Promise<boolean> {
    const result = await LogsMongooseModel.deleteOne({ ip, endpoint });
    return result.deletedCount === 1;
  },

  async deleteAll(): Promise<boolean> {
    await LogsMongooseModel.deleteMany({});
    return (await LogsMongooseModel.countDocuments()) === 0;
  },
};
