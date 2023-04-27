import { Router } from 'express';
import { checkResultAuth, getUser } from '../controllers/authController';
import { loginOrEmailValidators } from '../validators/loginOrEmailValidators';
import { validationMiddleware } from '../middlewares/ValidationErorrsMiddleware';
import { checkTokenAuth } from '../middlewares/checkTokenAuth';

export const authRouter = Router();

authRouter.post('/login', loginOrEmailValidators, validationMiddleware, checkResultAuth);
authRouter.get('/me', checkTokenAuth, getUser);
