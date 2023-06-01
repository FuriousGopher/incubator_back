import { LogsType } from '../models/logsType';
import { logsRepositories } from '../repositories/logs-repositories';

export const logsService = {
  async findLogsLimit(ip: string, endpoint: string) {
    return logsRepositories.findLogsLimit(ip, endpoint);
  },
  async createLogsLimit(ip: string, endpoint: string): Promise<LogsType> {
    const newRateLimit: LogsType = {
      ip: ip,
      endpoint: endpoint,
      firstAttempt: Date.now(),
      lastAttempt: Date.now(),
      attemptsCount: 1,
    };
    return logsRepositories.createLogsLimit(newRateLimit);
  },
  async updateCounter(ip: string, endpoint: string, currentDate: number): Promise<boolean> {
    const rateLimit = await logsRepositories.findLogsLimit(ip, endpoint);

    if (!rateLimit) {
      return false;
    }

    const attemptsCount = +rateLimit.attemptsCount + 1;

    return logsRepositories.updateCounter(ip, endpoint, attemptsCount, currentDate);
  },

  async deleteRateLimit(ip: string, endpoint: string): Promise<boolean> {
    return logsRepositories.deleteRateLimit(ip, endpoint);
  },
};
