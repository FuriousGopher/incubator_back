import { usersService } from '../services/usersService';
import { HttpStatusCode } from '../types/HTTP-Response';
import { Request, Response } from 'express';
import { jwtService } from '../aplication/jwt-service';

export const checkResultAuth = async (req: Request, res: Response) => {
  const result = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
  if (result) {
    const token = await jwtService.createJWT(result);
    res.status(HttpStatusCode.Created).send(token);
  } else {
    res.status(HttpStatusCode.Unauthorized).send('The password or login is wrong');
  }
};
export const getUser = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.send(HttpStatusCode.Unauthorized);
  }
  const user = await usersService.getUser(req.user?.id);
  if (!user) {
    res.sendStatus(404);
    return;
  }
  res.status(HttpStatusCode.Created).send({
    userId: user.id,
    email: user.email,
    login: user.login,
  });
};
