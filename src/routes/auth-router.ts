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

export const authRouter = Router();

authRouter.post('/login', loginOrEmailValidators, validationMiddleware, loginAuth);

authRouter.get('/me', checkTokenAuth, getUser);

authRouter.post('/refresh-token', refreshToken);

authRouter.post('/logout', logOut);

authRouter.post('/registration-confirmation', validationCodeInput, validationEmailConfirm, validationMiddleware, codeConfirmation);

authRouter.post(
  '/registration',
  createUserValidator,
  validatorForUserExistLogin('login'),
  validatorForUserExistEmail('email'),
  validationMiddleware,
  registrationOfUser,
);

authRouter.post('/registration-email-resending', emailValidator, validationEmailResend, validationMiddleware, resendEmailForRegistration);
