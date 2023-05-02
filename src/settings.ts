export const settings = {
  MONGO_URI: process.env.MONGO_URL,
  JWT_SECRET: process.env.SECRET_KEY || '1236',
  MY_EMAIL: process.env.MY_EMAIL,
  EMAIL_PASS: process.env.PASSWORD,
};
