import { usersRepositories } from '../repositories/users-repositories';
import { _generateHash } from '../helpFunction';
import { GetAllUsersQueryType } from '../DTO/QueryForUsers';
import { Document } from 'mongodb';

export const usersService = {
  async getAllUsers(query: GetAllUsersQueryType) {
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    const userResponse = await usersRepositories.getAllUsers(
      query.pageNumber,
      query.pageSize,
      query.sortBy,
      sortDirection,
      query.searchEmailTerm,
      query.searchLoginTerm,
    );
    const returnObject: {
      pagesCount: number;
      page: number;
      pageSize: number;
      totalCount: number;
      items: Document[];
      searchEmailTerm?: string;
      searchLoginTerm?: string;
    } = {
      pagesCount: +userResponse.totalNumberOfPages,
      page: +userResponse.currentPage,
      pageSize: userResponse.pageSize,
      totalCount: userResponse.totalNumberOfPosts,
      items: userResponse.users,
    };
    if (query.searchEmailTerm) {
      returnObject.searchEmailTerm = query.searchEmailTerm;
    }
    if (query.searchLoginTerm) {
      returnObject.searchLoginTerm = query.searchLoginTerm;
    }
    return returnObject;
  },
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersRepositories.findByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const passwordHash = await _generateHash(password, user.password);
    return user.password === passwordHash;
  },
  async deleteUserById(id: string) {
    return await usersRepositories.deleteUserById(id);
  },
  async createNewUser(email: string, login: string, password: string) {
    return await usersRepositories.createNewUser({ email, login, password });
  },
};
