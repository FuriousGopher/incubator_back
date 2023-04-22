import { usersService } from '../services/usersService';
import { HttpStatusCode } from '../types/HTTP-Response';
import { Request, Response } from 'express';

export const checkResultAuth = async (req: Request, res: Response) => {
  const result = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
  if (result) {
    res.status(HttpStatusCode.NoContent).send();
  } else {
    res.status(HttpStatusCode.Unauthorized).send('The password or login is wrong');
  }
};
