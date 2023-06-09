import { Router } from 'express';
import {
  codeConfirmation,
  getUser,
  loginAuth,
  logOut,
  newPassword,
  passwordRecovery,
  refreshToken,
  registrationOfUser,
  resendEmailForRegistration,
} from '../controllers/authController';
import { emailValidator, loginOrEmailValidators } from '../validators/validatorForLoginOrEmailInput';
import { validationMiddleware } from '../validators/validationErorrsMiddleware';
import { checkTokenAuth } from '../middlewares/checkTokenAuth';
import { createUserValidator } from '../validators/validatorForUserRegistration';
import { validatorForUserExistEmail, validatorForUserExistLogin } from '../validators/validatorForUserExist';
import { validationEmailConfirm, validationRecoveryCode } from '../validators/validatorForCodeConfirmation';
import { validationCodeInput } from '../validators/validationInputForCodeConfirmation';
import { validationEmailResend } from '../validators/validationForEmailReSend';
import { validatorForRefreshToken } from '../validators/validatorForRefreshToken';
import { logsLimiter } from '../middlewares/checkTimesOfLogsMiddleware';
import { validatorForNewPassword } from '../validators/validatorForNewPassword';

export const authRouter = Router();

authRouter.post('/login', logsLimiter, loginOrEmailValidators, validationMiddleware, loginAuth);

authRouter.get('/me', checkTokenAuth, getUser);

authRouter.post('/refresh-token', validatorForRefreshToken, refreshToken);

authRouter.post('/logout', validatorForRefreshToken, logOut);

authRouter.post(
  '/registration-confirmation',
  logsLimiter,
  validationCodeInput,
  validationEmailConfirm,
  validationMiddleware,
  codeConfirmation,
);

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

authRouter.post('/password-recovery', logsLimiter, emailValidator, validationMiddleware, passwordRecovery);

authRouter.post(
  '/new-password',
  logsLimiter,
  validatorForNewPassword,
  validationRecoveryCode,
  validationMiddleware,
  newPassword,
);
