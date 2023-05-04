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
    res.status(HttpStatusCode.Created).send('Input data is accepted. Email with confirmation code will be send to passed email address');
  }
};

export const codeConfirmation = async (req: Request, res: Response) => {
  let result;
  if (req.query.code) {
    result = await authService.confirmEmail(req.query.code as string);
  }
  if (result) {
    res.status(HttpStatusCode.OK).send('Email was verified. Account was activated');
  } else {
    res.status(HttpStatusCode.BadRequest).send('Confirmation code is incorrect, expired or already been applied');
  }
};

export const resendEmailForRegistration = async (req: Request, res: Response) => {
  if (!req.body.email) {
    return res.status(HttpStatusCode.BadRequest).send('The inputModel has incorrect values or if email is already confirmed');
  }
  const result = await authService.resendingEmail(req.body.email);
  if (result) {
    res.sendStatus(HttpStatusCode.NoContent);
  } else {
    res.sendStatus(HttpStatusCode.BadRequest);
  }
};
