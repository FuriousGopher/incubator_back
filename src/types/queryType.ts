export type MethodGetAllPostsReqQuery = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: string;
};

export type MethodGetAllUsersReqQuery = {
  searchEmailTerm: string;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: string;
  searchLoginTerm: string;
};

export type MethodGetAllReqQueryById = {
  searchNameTerm: null;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: string;
};
