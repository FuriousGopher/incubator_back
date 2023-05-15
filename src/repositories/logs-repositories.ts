import { LogsType } from '../models/logsType';
import { logCollection } from '../models/dbCollections';

export const logsRepositories = {
  async findLogsLimit(ip: string, endpoint: string): Promise<LogsType | null> {
    const foundRateLimit = await logCollection.findOne({ ip, endpoint });

    if (!foundRateLimit) {
      return null;
    }

    return foundRateLimit;
  },

  async createLogsLimit(rateLimit: LogsType): Promise<LogsType> {
    await logCollection.insertOne({ ...rateLimit });
    return rateLimit;
  },

  async updateCounter(ip: string, endpoint: string, attemptsCount: number, currentDate: number): Promise<boolean> {
    const result = await logCollection.updateOne(
      { ip, endpoint },
      {
        $set: { attemptsCount, lastAttempt: currentDate },
      },
    );
    return result.matchedCount === 1;
  },

  async deleteRateLimit(ip: string, endpoint: string): Promise<boolean> {
    const result = await logCollection.deleteOne({ ip, endpoint });
    return result.deletedCount === 1;
  },

  async deleteAll(): Promise<boolean> {
    await logCollection.deleteMany({});
    return (await logCollection.countDocuments()) === 0;
  },
};
