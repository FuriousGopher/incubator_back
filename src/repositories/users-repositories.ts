import { CreateUserDto, UserAccountDBType } from '../types/userType';
import bcrypt from 'bcrypt';
import { _generateHash } from '../helpFunction';
import { usersAccountsCollection } from '../models/dbCollections';
import { uuid } from 'uuidv4';
import { add } from 'date-fns';

export const usersRepositories = {
  async createNewUser(data: CreateUserDto) {
    const passwordSalt = await bcrypt.genSalt(4);
    const passwordHash = await _generateHash(data.password, passwordSalt);
    const newUser: UserAccountDBType = {
      id: uuid(),
      accountData: {
        login: data.login,
        email: data.email,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: uuid(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
        isConfirmed: true,
      },
      securityData: {
        refreshToken: uuid(),
      },
    };
    await usersAccountsCollection.insertOne({ ...newUser });
    return newUser;
  },

  async deleteUserById(id: string) {
    const result = await usersAccountsCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async getAllUsers(pageNumber: number, nPerPage: number, sortBy: string, sortDirection: 1 | -1, searchEmailTerm: string, searchLoginTerm: string) {
    const filter: any = {};
    if (searchLoginTerm || searchEmailTerm) {
      filter.$or = [];
    }
    if (searchEmailTerm) {
      filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }
    if (searchLoginTerm) {
      filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }
    const foundUsers = await usersAccountsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage)
      .toArray();
    const items = foundUsers.map((user: any) => ({
      id: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    }));
    const totalNumberOfPosts = await usersAccountsCollection.countDocuments(filter);
    return {
      users: items,
      totalNumberOfPosts: totalNumberOfPosts,
      currentPage: pageNumber,
      totalNumberOfPages: Math.ceil(totalNumberOfPosts / nPerPage),
      pageSize: nPerPage,
    };
  },

  async findByLoginOrEmail(loginOrEmail: string) {
    return await usersAccountsCollection.findOne({ $or: [{ 'accountData.login': loginOrEmail }, { 'accountData.email': loginOrEmail }] });
  },

  async findByCodeInUsersAccountsCollection(code: string) {
    return await usersAccountsCollection.findOne({ 'emailConfirmation.confirmationCode': code });
  },

  async findUserById(id: string) {
    return await usersAccountsCollection.findOne({ id });
  },

  async createUserByRegistration(newUser: UserAccountDBType) {
    return usersAccountsCollection.insertOne(newUser);
  },

  async updateIsConfirmed(id: string) {
    const result = await usersAccountsCollection.updateOne({ id }, { $set: { 'emailConfirmation.isConfirmed': true } });
    return result.modifiedCount === 1;
  },

  async updateConfirmationCode(id: string, newCode: string) {
    const result = await usersAccountsCollection.updateOne({ id }, { $set: { 'emailConfirmation.confirmationCode': newCode } });
    return result.modifiedCount === 1;
  },

  async findUserByEmail(email: string) {
    return await usersAccountsCollection.findOne({ 'accountData.email': email });
  },

  async addingNewRefreshToken(id: string | undefined, newRefreshToken: string) {
    const result = await usersAccountsCollection.updateOne({ id }, { $set: { 'securityData.refreshToken': newRefreshToken } });
    return result.modifiedCount === 1;
  },

  async findUserByRefreshToken(refreshToken: string) {
    return await usersAccountsCollection.findOne({ 'securityData.refreshToken': refreshToken });
  },
};
