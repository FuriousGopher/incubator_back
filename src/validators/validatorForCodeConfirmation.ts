import { body } from 'express-validator';
import { UsersRepositories } from '../repositories/users-repositories';
import { container } from '../composition-root';

const usersRepositories = container.resolve(UsersRepositories);

export const validationEmailConfirm = body('code').custom(async (code) => {
  const result = await usersRepositories.findByCodeInUsersMongooseModel(code);
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

export const validationRecoveryCode = body('recoveryCode').custom(async (recoveryCode) => {
  const result = await usersRepositories.findByCodeInUsersMongooseModel(recoveryCode);
  if (
    !result ||
    result.emailConfirmation.confirmationCode !== recoveryCode ||
    result.emailConfirmation.expirationDate! < new Date()
  ) {
    throw new Error('Confirmation code is incorrect, expired or already been applied');
  }
  return true;
});
