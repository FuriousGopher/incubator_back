import { Router } from 'express';
import { createUserValidator } from '../validators/UserRegistValidator';
import { validationMiddleware } from '../middlewares/ValidationErorrsMiddleware';
import { createNewUser, deleteUserById, getAllUsers } from '../controllers/usersController';

export const usersRouter = Router();

usersRouter.get('/', getAllUsers);
usersRouter.post('/', createUserValidator, validationMiddleware, createNewUser);
usersRouter.delete('/:id', deleteUserById);
