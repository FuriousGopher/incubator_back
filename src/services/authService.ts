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
        userName: newUser.login,
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

  async confirmEmail(code: string, email: string) {
    const user = await usersRepositories.findByEmailInUsersAccountsCollection(email);
    if (!user) return false;
    if (user.emailConfirmation.confirmationCode === code && user.emailConfirmation.expirationDate > new Date()) {
      return await usersRepositories.updateIsConfirmed(user.id);
    }
    return false;
  },
  async findUserByIdInUsersAccountsCollection(id: string) {
    return await usersRepositories.findUserByIdInUsersAccountsCollection(id);
  },
};
