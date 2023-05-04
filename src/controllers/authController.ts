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
  const user = await usersService.getUser(req.user?.id);
  if (!user) {
    const userAccount = await authService.findUserByIdInUsersAccountsCollection(req.user?.id);
    if (!userAccount) {
      return res.sendStatus(HttpStatusCode.NotFound);
    }
    return res.status(HttpStatusCode.OK).send({
      email: userAccount.accountData.email,
      login: userAccount.accountData.userName,
      userId: userAccount.id,
    });
  }
  return res.status(HttpStatusCode.OK).send({
    email: user.email,
    login: user.login,
    userId: user.id,
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
    res.status(HttpStatusCode.Created).send('Input data is accepted. Email with confirmation code will be send to passed email address');
  }
};

export const codeConfirmation = async (req: Request, res: Response) => {
  const result = await authService.confirmEmail(req.body.code, req.body.email);
  if (result) {
    res.status(HttpStatusCode.NoContent).send('Email was verified. Account was activated');
  } else {
    res.status(HttpStatusCode.BadRequest).send('Confirmation code is incorrect, expired or already been applied');
  }
};
