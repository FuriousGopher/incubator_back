import { UsersService } from '../services/usersService';
import { HttpStatusCode } from '../types/HTTP-Response';
import { Request, Response } from 'express';
import { jwtService } from '../aplication/jwt-service';
import { authService } from '../services/authService';
import { deviceService } from '../services/deviceService';
import { uuid } from 'uuidv4';
import { CreateUserDto } from '../models/userType';
import { container } from '../composition-root';
const REFRESH_TOKEN = 'refreshToken';

const usersService = container.resolve(UsersService);

export const loginAuth = async (req: Request, res: Response) => {
  const result = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
  if (result) {
    const deviceId = uuid();
    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || 'unknown';
    const newAccessToken = await jwtService.createJWT(result.id, deviceId);
    const newRefreshToken = await jwtService.createRefreshTokenJWT(result.id, deviceId);
    await deviceService.createDeviceList(newRefreshToken, ip, userAgent);
    res
      .cookie(REFRESH_TOKEN, newRefreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(HttpStatusCode.OK)
      .send({ accessToken: newAccessToken });
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
  const newUser: CreateUserDto = {
    accountData: {
      login: req.body.login,
      email: req.body.email,
      passwordHash: req.body.password,
      createdAt: new Date().toISOString(),
      isMembership: false,
    },
    emailConfirmation: {
      confirmationCode: uuid(),
      expirationDate: new Date(),
      isConfirmed: false,
    },
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

export const refreshToken = async (req: Request, res: Response) => {
  const cookieRefreshToken = req.cookies[REFRESH_TOKEN];
  const deviceId = req.deviceId!;
  const userId = req.user!.id;
  const lastActiveDate = await jwtService.lastActiveDate(cookieRefreshToken);
  const device = await deviceService.foundDeviceById(deviceId);
  if (!device) return res.sendStatus(HttpStatusCode.Unauthorized);
  if (device.lastActiveDate !== lastActiveDate) return res.sendStatus(HttpStatusCode.Unauthorized);
  if (device.userId !== userId) return res.sendStatus(HttpStatusCode.Forbidden);
  const newAccessToken = await jwtService.createJWT(userId, deviceId);
  const newRefreshToken = await jwtService.createRefreshTokenJWT(userId, deviceId);
  const newIssuedAt = await jwtService.lastActiveDate(newRefreshToken);
  await deviceService.updateDevice(userId, deviceId, newIssuedAt);
  res
    .cookie(REFRESH_TOKEN, newRefreshToken, {
      httpOnly: true,
      secure: true,
    })
    .status(HttpStatusCode.OK)
    .send({ accessToken: newAccessToken });
};

export const logOut = async (req: Request, res: Response) => {
  const cookieRefreshToken = req.cookies[REFRESH_TOKEN];
  const foundUserByRefreshToken = await jwtService.getUserIdByToken(cookieRefreshToken);
  if (foundUserByRefreshToken) {
    const user = await authService.findUserById(foundUserByRefreshToken.userId.toString());
    if (user) {
      const lastActiveDate = await jwtService.lastActiveDate(cookieRefreshToken);
      const device = await deviceService.foundDeviceById(foundUserByRefreshToken.deviceId);
      if (!device) return res.sendStatus(HttpStatusCode.Unauthorized);
      if (device.lastActiveDate !== lastActiveDate) return res.sendStatus(HttpStatusCode.Unauthorized);
      if (device.userId !== foundUserByRefreshToken.userId.toString()) return res.sendStatus(HttpStatusCode.Forbidden);
      await authService.deleteDevice(foundUserByRefreshToken.deviceId);
      res.cookie('refreshToken', '').sendStatus(HttpStatusCode.NoContent);
    } else {
      res.sendStatus(HttpStatusCode.Unauthorized);
    }
  } else {
    res.sendStatus(HttpStatusCode.Unauthorized);
  }
};

export const passwordRecovery = async (req: Request, res: Response) => {
  await authService.sendRecoveryCode(req.body.email);
  res.sendStatus(HttpStatusCode.NoContent);
};
export const newPassword = async (req: Request, res: Response) => {
  const result = await authService.newPassword(req.body.recoveryCode, req.body.newPassword);
  if (result) {
    res.sendStatus(HttpStatusCode.NoContent);
  } else {
    res.sendStatus(HttpStatusCode.BadRequest);
  }
};
