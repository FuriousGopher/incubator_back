import { CreatedUsertype } from '../types/userType';
import jwt from 'jsonwebtoken';
import { settings } from '../settings';

export const jwtService = {
  async createJWT(user: CreatedUsertype) {
    return jwt.sign({ userId: user.id }, settings.JWT_SECRET, { expiresIn: '10h' });
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return result.userId;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};