export type GetAllUsersQueryType = {
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: string;
  searchEmailTerm: string;
  searchLoginTerm: string;
};
