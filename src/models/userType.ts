export type CreateUserDto = Omit<
  UserDBModel,
  | 'id'
  | 'accountData.createdAt'
  | 'accountData.isMembership'
  | 'emailConfirmation.confirmationCode'
  | 'emailConfirmation.expirationDate'
  | 'emailConfirmation.isConfirmed'
>;

export type CreatedUsertype = Omit<UserDBModel, 'password'>;
export class UserDBModel {
  constructor(
    public id: string,
    public accountData: {
      login: string;
      email: string;
      passwordHash: string;
      createdAt: string;
      isMembership: boolean;
    },
    public emailConfirmation: {
      confirmationCode: string | null;
      expirationDate: Date | null;
      isConfirmed: boolean;
    },
  ) {}
}
