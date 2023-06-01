import mongoose from 'mongoose';
import { UserDBModel } from '../models/userType';

const userSchema = new mongoose.Schema<UserDBModel>({
  id: { type: String, required: true },
  accountData: {
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
  },
  emailConfirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
});

export const UsersMongooseModel = mongoose.model('users', userSchema);
