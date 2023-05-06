import { CreateUserDto, UserAccountDBType, UserModel } from '../types/userType';
import bcrypt from 'bcrypt';
import { _generateHash } from '../helpFunction';
import { usersAccountsCollection, usersCollection } from '../models/dbCollections';
import { uuid } from 'uuidv4';

export const usersRepositories = {
  async createNewUser(data: CreateUserDto) {
    const passwordSalt = await bcrypt.genSalt(4);
    const passwordHash = await _generateHash(data.password, passwordSalt);
    const newUser: UserModel = {
      id: uuid(),
      login: data.login,
      email: data.email,
      password: passwordHash,
      createdAt: new Date().toISOString(),
    };
    await usersCollection.insertOne({ ...newUser });
    return newUser;
  },

  async deleteUserById(id: string) {
    const result = await usersCollection.deleteOne({ id: id });
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
    const foundUsers = await usersCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage)
      .project({ _id: false, password: false })
      .toArray();

    const totalNumberOfPosts = await usersCollection.countDocuments(filter);
    return {
      users: foundUsers,
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
  async findUserByEmail(email: string) {
    return await usersAccountsCollection.findOne({ 'accountData.email': email });
  },
};
