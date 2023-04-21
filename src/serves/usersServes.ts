import { usersRepositories } from '../repositories/users-repositories';
import { _generateHash } from '../helpFunction';
import { GetAllUsersQueryType } from '../DTO/QueryForUsers';

export const usersServes = {
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
      // searchEmailTerm: query.searchEmailTerm,
      // searchLoginTerm: query.searchLoginTerm,
      items: userResponse.users,
    };
  },
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersRepositories.findByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const passwordHash = await _generateHash(password, user.password);
    return user.password === passwordHash;
  },
};
