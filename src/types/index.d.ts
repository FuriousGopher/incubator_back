import { CreatedUsertype } from '../models/userType';

declare global {
  declare namespace Express {
    export interface Request {
      user: { id: string } | null;
    }
  }
}
