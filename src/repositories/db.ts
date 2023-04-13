import {MongoClient} from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config()


const mongoURI = process.env.MONGO_URL
if (!mongoURI){
    throw new Error('URL problem ')
}
export const client = new MongoClient(mongoURI);


console.log(process.env.MONGO_URL)
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