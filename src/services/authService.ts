import { CreateUserDto, UserAccountDBType } from '../types/userType';
import bcrypt from 'bcrypt';
import { _generateHash } from '../helpFunction';
import { uuid } from 'uuidv4';
import { add } from 'date-fns';
import { usersRepositories } from '../repositories/users-repositories';
import { emailAdapter } from '../adapters/email-adapter';

export const authService = {
  async createUser(newUser: CreateUserDto) {
    const passwordSalt = await bcrypt.genSalt(4);
    const passwordHash = await _generateHash(newUser.password, passwordSalt);
    const createdUser: UserAccountDBType = {
      id: uuid(),
      accountData: {
        login: newUser.login,
        email: newUser.email,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
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
    const user = await usersRepositories.findByCodeInUsersAccountsCollection(code);
    if (!user) return false;
    return await usersRepositories.updateIsConfirmed(user.id);
  },

  async findUserById(id: string) {
    return await usersRepositories.findUserById(id);
  },

  async resendingEmail(email: string) {
    const user = await usersRepositories.findUserByEmail(email);
    if (!user) return false;
    return await emailAdapter.sendEmail(user.accountData.email, user.emailConfirmation.confirmationCode);
  },
};
