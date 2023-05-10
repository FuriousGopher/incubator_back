import express from 'express';
import bodyParser from 'body-parser';
import { runDb } from './repositories/db';
import { router } from './router/allRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dbLogs } from './models/dbCollections';
import { LogsType } from './models/logsType';

export const app = express();

const port = process.env.PORT || 3004;

app.set('trust proxy', true);

const jsonBodyMiddleware = express.json();

app.use(cookieParser());

app.use(bodyParser());

app.use(cors());

app.use(jsonBodyMiddleware);

app.use(async (req, res, next) => {
  const { ip } = req;
  const url = req.baseUrl || req.originalUrl;
  const date = new Date();
  const logEntry: LogsType = { ip: ip, URL: url, date };
  await dbLogs.collection<LogsType>('logs').insertOne(logEntry);
  next();
});

app.use(async (req, res, next) => {
  const { ip } = req;
  const url = req.baseUrl || req.originalUrl;
  const date = new Date(Date.now() - 10000);
  res.locals.count = await dbLogs.collection<LogsType>('logs').countDocuments({
    IP: ip,
    URL: url,
    date: { $gte: date },
  });
  next();
});

app.use(router);
const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startApp();
