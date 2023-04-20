export type UserModel = {
  id: string;
  login: string;
  email: string;
  password: string;
  createdAt: string;
};

export type CreateUserDto = Omit<UserModel, 'id' | 'createdAt'>;

export type CreatedUsertype = Omit<UserModel, 'password'>;
