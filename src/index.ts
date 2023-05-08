import express from 'express';
import bodyParser from 'body-parser';
import { runDb } from './repositories/db';
import { router } from './router/allRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const app = express();

const port = process.env.PORT || 3004;

const jsonBodyMiddleware = express.json();

app.use(cookieParser());

app.use(bodyParser());

app.use(cors());

app.use(jsonBodyMiddleware);

app.use(router);
const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startApp();
