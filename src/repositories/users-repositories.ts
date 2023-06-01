import bcrypt from 'bcrypt';
import { _generateHash } from '../helpFunction';
import { uuid } from 'uuidv4';
import { add } from 'date-fns';
import { UsersMongooseModel } from '../Domain/UserSchema';
import { UserDBModel } from '../models/userType';

export const usersRepositories = {
  async createNewUser(email: string, login: string, password: string) {
    const passwordSalt = await bcrypt.genSalt(4);
    const passwordHash = await _generateHash(password, passwordSalt);
    const newUser: UserDBModel = {
      id: uuid(),
      accountData: {
        login: login,
        email: email,
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
        isConfirmed: true,
      },
    };
    await UsersMongooseModel.create({ ...newUser });
    return newUser;
  },

  async deleteUserById(id: string) {
    const result = await UsersMongooseModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async getAllUsers(
    pageNumber: number,
    nPerPage: number,
    sortBy: string,
    sortDirection: 1 | -1,
    searchEmailTerm: string,
    searchLoginTerm: string,
  ) {
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
    const foundUsers = await UsersMongooseModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage)
      .lean();
    const items = foundUsers.map((user: any) => ({
      id: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    }));
    const totalNumberOfPosts = await UsersMongooseModel.countDocuments(filter);
    return {
      users: items,
      totalNumberOfPosts: totalNumberOfPosts,
      currentPage: pageNumber,
      totalNumberOfPages: Math.ceil(totalNumberOfPosts / nPerPage),
      pageSize: nPerPage,
    };
  },

  async findByLoginOrEmail(loginOrEmail: string) {
    return await UsersMongooseModel.findOne({
      $or: [{ 'accountData.login': loginOrEmail }, { 'accountData.email': loginOrEmail }],
    });
  },

  async findByCodeInUsersMongooseModel(code: string) {
    return await UsersMongooseModel.findOne({ 'emailConfirmation.confirmationCode': code });
  },

  async findUserById(id: string) {
    return await UsersMongooseModel.findOne({ id });
  },

  async createUserByRegistration(newUser: UserDBModel) {
    return UsersMongooseModel.create(newUser);
  },

  async updateIsConfirmed(id: string) {
    const result = await UsersMongooseModel.updateOne({ id }, { $set: { 'emailConfirmation.isConfirmed': true } });
    return result.modifiedCount === 1;
  },

  async updateConfirmationCode(id: string, newCode: string) {
    const result = await UsersMongooseModel.updateOne(
      { id },
      { $set: { 'emailConfirmation.confirmationCode': newCode } },
    );
    return result.modifiedCount === 1;
  },

  async findUserByEmail(email: string) {
    return await UsersMongooseModel.findOne({ 'accountData.email': email });
  },

  async addingNewRefreshToken(id: string | undefined, newRefreshToken: string) {
    const result = await UsersMongooseModel.updateOne(
      { id },
      { $set: { 'securityData.refreshToken': newRefreshToken } },
    );
    return result.modifiedCount === 1;
  },

  async deleteDevice(deviceId: string) {
    const result = await UsersMongooseModel.deleteOne({ deviceId });
    return result.deletedCount === 1;
  },

  async findUserByRefreshToken(refreshToken: string) {
    return await UsersMongooseModel.findOne({ 'securityData.refreshToken': refreshToken });
  },
};
