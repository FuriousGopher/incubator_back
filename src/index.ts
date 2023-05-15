import express from 'express';
import { runDb } from './repositories/db';
import { router } from './router/allRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
export const app = express();

const port = process.env.PORT || 3004;

app.set('trust proxy', true);

app.use(cookieParser());

app.use(express.json());

app.use(cors());

app.use(router);
const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startApp();
