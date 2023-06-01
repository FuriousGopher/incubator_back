import { body } from 'express-validator';
import { usersRepositories } from '../repositories/users-repositories';

export const validationEmailConfirm = body('code').custom(async (code) => {
  const result = await usersRepositories.findByCodeInUsersMongooseModel(code);
  if (
    !result ||
    result.emailConfirmation.isConfirmed ||
    result.emailConfirmation.confirmationCode !== code ||
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    result.emailConfirmation.expirationDate! < new Date()
  ) {
    throw new Error('Confirmation code is incorrect, expired or already been applied');
  }
  return true;
});
