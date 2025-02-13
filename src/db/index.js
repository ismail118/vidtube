import { MongoClient } from "mongodb";
import { DB_NAME } from "../consts.js";

let db

const connectDB = async function connect() {
    try {
        const client = new MongoClient(process.env.MONGO_URI)
        await client.connect()
        await client.db(DB_NAME).command({ ping: 1})

        db = client.db(DB_NAME)
        console.log("Success connect to mongodb");
    } catch (err) {
        console.log("Error connect to db:", err);
        process.exit(1)
    }
}

export { db, connectDB }