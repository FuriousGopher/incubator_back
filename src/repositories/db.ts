import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'


dotenv.config()

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'


console.log(process.env.MONGO_URL)
export const client = new MongoClient(mongoURI);

export async function runDb() {
    try {
        await client.connect();

        await client.db("blogs").command({ping: 1});
        console.log("Connected successfully")
    } catch {
        console.log("Error to connect")
        await client.close()
    }

}