import { Router } from 'express';
import {
  codeConfirmation,
  getUser,
  loginAuth,
  logOut,
  refreshToken,
  registrationOfUser,
  resendEmailForRegistration,
} from '../controllers/authController';
import { emailValidator, loginOrEmailValidators } from '../validators/loginOrEmailValidators';
import { validationMiddleware } from '../middlewares/ValidationErorrsMiddleware';
import { checkTokenAuth } from '../middlewares/checkTokenAuth';
import { createUserValidator } from '../validators/UserRegistValidator';
import { validatorForUserExistEmail, validatorForUserExistLogin } from '../validators/validatorForUserExist';
import { validationEmailConfirm } from '../validators/validatorForCodeConfirmation';
import { validationCodeInput } from '../validators/validationInputForCodeConfirmation';
import { validationEmailResend } from '../validators/validationForEmailReSend';
import { validatorForRefreshToken } from '../validators/validatorForRefreshToken';
import { logsLimiter } from '../middlewares/checkTimesOfLogsLogsMiddleware';

export const authRouter = Router();

authRouter.post('/login', logsLimiter, loginOrEmailValidators, validationMiddleware, loginAuth);

authRouter.get('/me', checkTokenAuth, getUser);

authRouter.post('/refresh-token', validatorForRefreshToken, refreshToken);

authRouter.post('/logout', validatorForRefreshToken, logOut);

authRouter.post('/registration-confirmation', logsLimiter, validationCodeInput, validationEmailConfirm, validationMiddleware, codeConfirmation);

authRouter.post(
  '/registration',
  logsLimiter,
  createUserValidator,
  validatorForUserExistLogin('login'),
  validatorForUserExistEmail('email'),
  validationMiddleware,
  registrationOfUser,
);

authRouter.post(
  '/registration-email-resending',
  logsLimiter,
  emailValidator,
  validationEmailResend,
  validationMiddleware,
  resendEmailForRegistration,
);
