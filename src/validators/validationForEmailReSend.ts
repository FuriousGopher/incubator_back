import { body } from 'express-validator';
import { usersRepositories } from '../repositories/users-repositories';

export const validationEmailResend = body('email').custom(async (email) => {
  const user = await usersRepositories.findUserByEmail(email);
  if (!user || user.emailConfirmation.isConfirmed) {
    throw new Error('User with provided email not found or is already confirmed');
  }
  return true;
});
