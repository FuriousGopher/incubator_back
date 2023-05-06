import { usersService } from '../services/usersService';
import { HttpStatusCode } from '../types/HTTP-Response';
import { Request, Response } from 'express';
import { jwtService } from '../aplication/jwt-service';
import { authService } from '../services/authService';

export const checkResultAuth = async (req: Request, res: Response) => {
  const result = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
  if (result) {
    const token = await jwtService.createJWT(result);
    res.status(HttpStatusCode.OK).send({ accessToken: token });
  } else {
    res.status(HttpStatusCode.Unauthorized).send('The password or login is wrong');
  }
};
export const getUser = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.send(HttpStatusCode.Unauthorized);
  }
  const userAccount = await authService.findUserById(req.user?.id);
  if (!userAccount) {
    return res.sendStatus(HttpStatusCode.NotFound);
  }
  return res.status(HttpStatusCode.OK).send({
    email: userAccount.accountData.email,
    login: userAccount.accountData.login,
    userId: userAccount.id,
  });
};

export const registrationOfUser = async (req: Request, res: Response) => {
  const newUser = {
    login: req.body.login,
    email: req.body.email,
    password: req.body.password,
  };
  const createdUser = await authService.createUser(newUser);
  if (createdUser) {
    res.sendStatus(HttpStatusCode.NoContent);
  }
};

export const codeConfirmation = async (req: Request, res: Response) => {
  const code = req.body.code;
  const result = await authService.confirmEmail(code);
  if (result) {
    res.sendStatus(HttpStatusCode.NoContent);
  } else {
    res.sendStatus(HttpStatusCode.BadRequest);
  }
};

export const resendEmailForRegistration = async (req: Request, res: Response) => {
  const result = await authService.resendingEmail(req.body.email);
  if (result) {
    res.sendStatus(HttpStatusCode.NoContent);
  } else {
    res.sendStatus(HttpStatusCode.BadRequest);
  }
};
