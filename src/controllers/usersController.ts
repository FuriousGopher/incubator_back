import { Request, Response } from 'express';
import { HttpStatusCode } from '../types/HTTP-Response';
import { MethodGetAllUsersReqQuery } from '../types/queryType';
import { UsersService } from '../services/usersService';

export class UsersController {
  constructor(protected usersService: UsersService) {}
  async createNewUser(req: Request, res: Response) {
    const { email, login, password } = req.body;
    const newUser = await this.usersService.createNewUser(email, login, password);
    res.status(HttpStatusCode.Created).send(newUser);
  }

  async deleteUserById(req: Request, res: Response) {
    const id = req.params.id;
    const isDeleted = await this.usersService.deleteUserById(id);
    if (isDeleted) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
  async getAllUsers(
    req: Request<NonNullable<unknown>, NonNullable<unknown>, NonNullable<unknown>, MethodGetAllUsersReqQuery>,
    res: Response,
  ) {
    const query = {
      pageSize: Number(req.query.pageSize) || 10,
      pageNumber: Number(req.query.pageNumber) || 1,
      sortBy: req.query.sortBy ?? 'createdAt',
      sortDirection: req.query.sortDirection ?? 'desc',
      searchEmailTerm: req.query.searchEmailTerm ?? null,
      searchLoginTerm: req.query.searchLoginTerm ?? null,
    };
    const response = await this.usersService.getAllUsers(query);
    if (response.items) {
      res.status(HttpStatusCode.OK).send(response);
    } else {
      res.status(HttpStatusCode.NotFound).send('Users not found');
    }
  }
}
