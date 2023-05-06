import { body } from 'express-validator';
import { usersRepositories } from '../repositories/users-repositories';

export const validatorForUserExistLogin = (login: string) =>
  body(login).custom(async (login: string) => {
    const result = await usersRepositories.findByLoginOrEmail(login);
    if (result) {
      throw new Error('User already registered');
    }
    return true;
  });

export const validatorForUserExistEmail = (email: string) =>
  body(email).custom(async (email: string) => {
    const result = await usersRepositories.findByLoginOrEmail(email);
    if (result) {
      throw new Error('User already registered');
    }
    return true;
  });
