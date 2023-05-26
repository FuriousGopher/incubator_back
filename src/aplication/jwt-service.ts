import jwt from 'jsonwebtoken';
import { settings } from '../settings';

export const jwtService = {
  async createJWT(userId: string, deviceId: string) {
    return jwt.sign({ userId: userId, deviceId }, settings.JWT_SECRET, { expiresIn: '10m' });
  },
  async getUserIdByToken(token: string) {
    try {
      return jwt.verify(token, settings.JWT_SECRET) as {
        userId: number;
        deviceId: string;
        iat: number;
        exp: number;
      };
    } catch (error) {
      return null;
    }
  },

  async lastActiveDate(token: string) {
    const payload: any = jwt.decode(token);
    return new Date(payload.iat * 1000).toISOString();
  },

  async createRefreshTokenJWT(userId: string, deviceId: string) {
    return jwt.sign({ userId: userId, deviceId }, settings.JWT_SECRET, { expiresIn: '20m' });
  },
};
