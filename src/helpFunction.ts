import bcrypt from 'bcrypt';

export const _generateHash = async (password: string, salt: string) => {
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
