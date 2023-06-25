import { Router } from 'express';
import { createUserValidator } from '../validators/validatorForUserRegistration';
import { container } from '../composition-root';
import { validationMiddleware } from '../validators/validationErorrsMiddleware';
import { validatorForUserExistEmail, validatorForUserExistLogin } from '../validators/validatorForUserExist';
import { UsersController } from '../controllers/usersController';

export const usersRouter = Router();
const usersController = container.resolve(UsersController);

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
