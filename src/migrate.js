import 'dotenv/config'
import { DB, Client, connectDB } from './db/index.js'
import { up } from './migrations/create-collections.js'

async function runMigrations() {
    try {
        await connectDB()
        await up(DB, Client)
    } catch (err) {
        console.log("Error migration", err);        
    } finally {
        Client.close()
    }

}

runMigrations()