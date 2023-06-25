import { body } from 'express-validator';
import { UsersRepositories } from '../repositories/users-repositories';
import { container } from '../composition-root';

const usersRepositories = container.resolve(UsersRepositories);

export const validationEmailResend = body('email').custom(async (email) => {
  const user = await usersRepositories.findUserByEmail(email);
  if (!user || user.emailConfirmation.isConfirmed) {
    throw new Error('User with provided email not found or is already confirmed');
  }
  return true;
});
