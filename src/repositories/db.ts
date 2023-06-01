import * as dotenv from 'dotenv';
import { settings } from '../settings';
import mongoose from 'mongoose';

dotenv.config();

const mongoURI = settings.MONGO_URI;
if (!mongoURI) {
  throw new Error('URL problem ');
}
///export const client = new MongoClient(mongoURI);

export async function runDb() {
  try {
    /// await client.connect();
    await mongoose.connect(mongoURI, { dbName: 'Cluster0' });
    ///  await client.db('Cluster0').command({ ping: 1 });
    console.log('Connected successfully');
  } catch {
    console.log('Error to connect');
    //await client.close();
    await mongoose.disconnect();
  }
}
