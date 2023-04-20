import { usersRepositories } from '../repositories/users-repositories';

type GetAllUsersQueryType = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: string;
  searchEmailTerm: string;
  searchLoginTerm: string;
};
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
      searchEmailTerm: query.searchEmailTerm,
      searchLoginTerm: query.searchLoginTerm,
      items: userResponse.users,
    };
  },
};
