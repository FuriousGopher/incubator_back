import { Router } from 'express';
import { createUserValidator } from '../validators/validatorForUserRegistration';
import { validationMiddleware } from '../validators/ValidationErorrsMiddleware';
import { createNewUser, deleteUserById, getAllUsers } from '../controllers/usersController';
import { validatorForUserExistEmail, validatorForUserExistLogin } from '../validators/validatorForUserExist';

export const usersRouter = Router();

usersRouter.get('/', getAllUsers);
usersRouter.post(
  '/',
  createUserValidator,
  validatorForUserExistLogin('login'),
  validatorForUserExistEmail('email'),
  validationMiddleware,
  createNewUser,
);
usersRouter.delete('/:id', deleteUserById);
