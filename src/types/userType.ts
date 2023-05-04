export type UserModel = {
  id: string;
  login: string;
  email: string;
  password: string;
  createdAt: string;
};

export type CreateUserDto = Omit<UserModel, 'id' | 'createdAt'>;

export type CreatedUsertype = Omit<UserModel, 'password'>;

export type UserAccountDBType = {
  id: string;
  accountData: {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: any;
    isConfirmed: boolean;
  };
};
