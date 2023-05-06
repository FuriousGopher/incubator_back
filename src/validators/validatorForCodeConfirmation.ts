import { body } from 'express-validator';
import { usersRepositories } from '../repositories/users-repositories';

export const validationEmailConfirm = body('code').custom(async (code) => {
  const result = await usersRepositories.findByCodeInUsersAccountsCollection(code);
  if (
    !result ||
    result.emailConfirmation.isConfirmed ||
    result.emailConfirmation.confirmationCode !== code ||
    result.emailConfirmation.expirationDate! < new Date()
  ) {
    throw new Error('Confirmation code is incorrect, expired or already been applied');
  }
  return true;
});
