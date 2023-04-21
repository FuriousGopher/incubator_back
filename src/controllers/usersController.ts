import { Request, Response } from 'express';
import { HttpStatusCode } from '../types/HTTP-Response';
import { usersRepositories } from '../repositories/users-repositories';
import { CreatedUsertype } from '../types/userType';
import { MethodGetAllUsersReqQuery } from '../types/queryType';
import { usersServes } from '../serves/usersServes';

export const createNewUser = async (req: Request, res: Response) => {
  const { email, login, password } = req.body;
  const newUser = await usersRepositories.createNewUser({ email, login, password });
  const createdUser: CreatedUsertype = {
    id: newUser.id,
    login: newUser.login,
    email: newUser.email,
    createdAt: newUser.createdAt,
  };
  res.status(HttpStatusCode.Created).send(createdUser);
};

export const deleteUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const isDeleted = await usersRepositories.deleteUserById(id);
  if (isDeleted) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
};

export const getAllUsers = async (
  req: Request<NonNullable<unknown>, NonNullable<unknown>, NonNullable<unknown>, MethodGetAllUsersReqQuery>,
  res: Response,
) => {
  const query = {
    pageSize: Number(req.query.pageSize) || 10,
    pageNumber: Number(req.query.pageNumber) ?? 1,
    sortBy: req.query.sortBy ?? 'createdAt',
    sortDirection: req.query.sortDirection ?? 'desc',
    searchEmailTerm: req.query.searchEmailTerm ?? null,
    searchLoginTerm: req.query.searchLoginTerm ?? null,
  };
  const response = await usersServes.getAllUsers(query);
  if (response.items) {
    res.status(HttpStatusCode.OK).send(response);
  } else {
    res.status(HttpStatusCode.NotFound).send('Users not found');
  }
};
