import { usersRepositories } from '../repositories/users-repositories';
import { _generateHash } from '../helpFunction';
import { GetAllUsersQueryType } from '../DTO/QueryForUsers';

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
    return {
      pagesCount: +userResponse.totalNumberOfPages,
      page: +userResponse.currentPage,
      pageSize: userResponse.pageSize,
      totalCount: userResponse.totalNumberOfPosts,
      items: userResponse.users,
    };
  },
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersRepositories.findByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const passwordHash = await _generateHash(password, user.password);
    const findUser = user.password === passwordHash;
    if (findUser) {
      return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      };
    } else {
      return false;
    }
  },
  async deleteUserById(id: string) {
    return await usersRepositories.deleteUserById(id);
  },
  async createNewUser(email: string, login: string, password: string) {
    return await usersRepositories.createNewUser({ email, login, password });
  },
  async findUserById(id: string) {
    return await usersRepositories.findUserById(id);
  },
  async getUser(id: string) {
    return await usersRepositories.findUserById(id);
  },
};
