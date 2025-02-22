import { MongoClient } from "mongodb";
import { DB_NAME } from "../consts.js";

let DB
let Client

async function connectDB() {
    try {
        const client = new MongoClient(process.env.MONGO_URI)
        await client.connect()
        await client.db(DB_NAME).command({ ping: 1})
        DB = client.db(DB_NAME)
        Client = client
        console.log("Success connect to mongodb");
    } catch (err) {
        console.log("Error connect to db:", err);
        process.exit(1)
    }
}

export {DB, Client, connectDB}