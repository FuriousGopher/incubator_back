import { Router } from 'express';
import { checkResultAuth, codeConfirmation, getUser, registrationOfUser } from '../controllers/authController';
import { loginOrEmailValidators } from '../validators/loginOrEmailValidators';
import { validationMiddleware } from '../middlewares/ValidationErorrsMiddleware';
import { checkTokenAuth } from '../middlewares/checkTokenAuth';
import { createUserValidator } from '../validators/UserRegistValidator';

export const authRouter = Router();

authRouter.post('/login', loginOrEmailValidators, validationMiddleware, checkResultAuth);
authRouter.get('/me', checkTokenAuth, getUser);
authRouter.post('/registration-confirmation', codeConfirmation);
authRouter.post('/registration', createUserValidator, validationMiddleware, registrationOfUser);
authRouter.post('/registration-email-resending');
