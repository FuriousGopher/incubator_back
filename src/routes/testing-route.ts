import { Router } from 'express';
import { Request, Response } from 'express';
import { BlogsMongooseModel } from '../Domain/BlogSchema';
import { UsersMongooseModel } from '../Domain/UserSchema';
import { CommentsMongooseModel } from '../Domain/CommentSchema';
import { PostsMongooseModel } from '../Domain/PostSchema';
import { LogsMongooseModel } from '../Domain/LogsSchema';
import { DevicesMongooseModel } from '../Domain/DeviceSchema';

export const testRouter = Router();

const allCollections = [
  BlogsMongooseModel,
  UsersMongooseModel,
  CommentsMongooseModel,
  PostsMongooseModel,
  LogsMongooseModel,
  DevicesMongooseModel,
];
testRouter.delete('/all-data', async (req: Request, res: Response) => {
  try {
    const promises = allCollections.map(async (collection: any) => {
      await collection.deleteMany({});
    });

    await Promise.all(promises);

    res.status(204).send('All data is deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting all data');
  }
});
