import {Router} from 'express';
import {Request, Response} from 'express';
import {collections} from "../models/dbCollections";

export const testRouter = Router();

testRouter.delete('/all-data', async (req: Request, res: Response) => {
    try {

        const promises = collections.map((collection) =>
            collection.deleteMany({})
        );

        await Promise.all(promises);

        res.status(204).send('All data is deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting all data');
    }
});


// import {Router} from 'express'
// import {Request, Response} from "express";
// import {client} from "../repositories/db";
//
// export const testRouter = Router()
//
//
// testRouter.delete('/all-data', async (req: Request, res: Response) => {
//     async function deleteDatabase() {
//         try {
//             await client.connect();
//             const database = client.db('videos');
//             await database.dropDatabase();
//             console.log('Database deleted successfully');
//         } catch (error) {
//             console.error('Error deleting database:', error);
//         } finally {
//             await client.close();
//         }
//     }
// });