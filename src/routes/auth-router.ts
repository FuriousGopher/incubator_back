import { Router } from 'express';
import { checkResultAuth } from '../controllers/authController';
import { loginOrEmailValidators } from '../validators/loginOrEmailValidators';
import { validationMiddleware } from '../middlewares/ValidationErorrsMiddleware';

export const authRouter = Router();

authRouter.post('/login', loginOrEmailValidators, validationMiddleware, checkResultAuth);
