import { CreatedUsertype } from '../models/userType';
import jwt from 'jsonwebtoken';
import { settings } from '../settings';

export const jwtService = {
  async createJWT(user: CreatedUsertype) {
    return jwt.sign({ userId: user.id }, settings.JWT_SECRET, { expiresIn: '5m' });
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
      console.log(error);
      return null;
    }
  },

  async createRefreshTokenJWT(user: CreatedUsertype) {
    return jwt.sign({ userId: user.id }, settings.JWT_SECRET, { expiresIn: '5m' });
  },
};
