import { Router } from 'express';
import { createUserValidator } from '../validators/validatorForUserRegistration';
import { validationMiddleware } from '../validators/validationErorrsMiddleware';
import { usersController } from '../controllers/usersController';
import { validatorForUserExistEmail, validatorForUserExistLogin } from '../validators/validatorForUserExist';

export const usersRouter = Router();

usersRouter.get('/', usersController.getAllUsers.bind(usersController));
usersRouter.post(
  '/',
  createUserValidator,
  validatorForUserExistLogin('login'),
  validatorForUserExistEmail('email'),
  validationMiddleware,
  usersController.createNewUser.bind(usersController),
);
usersRouter.delete('/:id', usersController.deleteUserById.bind(usersController));
