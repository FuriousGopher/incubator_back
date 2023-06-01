import { CreateUserDto, UserDBModel } from '../models/userType';
import bcrypt from 'bcrypt';
import { _generateHash } from '../helpFunction';
import { uuid } from 'uuidv4';
import { add } from 'date-fns';
import { usersRepositories } from '../repositories/users-repositories';
import { emailAdapter } from '../adapters/email-adapter';

export const authService = {
  async createUser(newUser: CreateUserDto) {
    const passwordSalt = await bcrypt.genSalt(4);
    const passwordHash = await _generateHash(newUser.accountData.passwordHash, passwordSalt);
    const createdUser: UserDBModel = {
      id: uuid(),
      accountData: {
        login: newUser.accountData.login,
        email: newUser.accountData.email,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
        isMembership: false,
      },
      emailConfirmation: {
        confirmationCode: uuid(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
        isConfirmed: false,
      },
    };
    const createResult = usersRepositories.createUserByRegistration(createdUser);
    await emailAdapter.sendEmail(createdUser.accountData.email, createdUser.emailConfirmation.confirmationCode);
    return createResult;
  },

  async confirmEmail(code: string) {
    const user = await usersRepositories.findByCodeInUsersMongooseModel(code);
    if (!user) return false;
    return await usersRepositories.updateIsConfirmed(user.id);
  },

  async findUserById(id: string) {
    return await usersRepositories.findUserById(id);
  },

  async resendingEmail(email: string) {
    const user = await usersRepositories.findUserByEmail(email);
    if (!user) return false;
    const newConfirmationCode = uuid();
    if (user) {
      await emailAdapter.sendEmail(user.accountData.email, newConfirmationCode);
    }
    return usersRepositories.updateConfirmationCode(user.id, newConfirmationCode);
  },

  async addingNewRefreshToken(id: string | undefined, newRefreshToken: string) {
    return await usersRepositories.addingNewRefreshToken(id, newRefreshToken);
  },

  async deleteDevice(deviceId: string) {
    return await usersRepositories.deleteDevice(deviceId);
  },

  async findUserByRefreshToken(refreshToken: string) {
    const findUser = await usersRepositories.findUserByRefreshToken(refreshToken);
    if (findUser) {
      return {
        id: findUser.id,
        login: findUser.accountData.login,
        email: findUser.accountData.email,
        createdAt: findUser.accountData.createdAt,
      };
    } else {
      return false;
    }
  },
};
