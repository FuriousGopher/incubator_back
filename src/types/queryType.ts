import { Request } from 'express';

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
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};

export type QueryForRequest<Q> = Request<NonNullable<unknown>, NonNullable<unknown>, NonNullable<unknown>, Q>;
