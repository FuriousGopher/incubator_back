import { UsersRepositories } from '../repositories/users-repositories';
import { _generateHash } from '../helpFunction';
import { GetAllUsersQueryType } from '../DTO/QueryForUsers';

export class UsersService {
  constructor(protected usersRepositories: UsersRepositories) {}
  async getAllUsers(query: GetAllUsersQueryType) {
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    const userResponse = await this.usersRepositories.getAllUsers(
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
  }

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await this.usersRepositories.findByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    if (!user.emailConfirmation.isConfirmed) return false;
    const passwordHash = await _generateHash(password, user.accountData.passwordHash);
    const findUser = user.accountData.passwordHash === passwordHash;
    if (findUser) {
      return {
        id: user.id,
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
      };
    } else {
      return false;
    }
  }

  async deleteUserById(id: string) {
    return await this.usersRepositories.deleteUserById(id);
  }

  async createNewUser(email: string, login: string, password: string) {
    const newUser = await this.usersRepositories.createNewUser(email, login, password);

    return {
      id: newUser.id,
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
  }

  async findUserById(id: string | undefined) {
    return await this.usersRepositories.findUserById(id);
  }
}
