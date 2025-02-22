import app from './app.js'
import dotenv from 'dotenv'
import { connectDB } from './db/index.js'

dotenv.config({
    path: "./src/.env"
})

const PORT = process.env.PORT || 6000

try {
    await connectDB()
    app.listen(PORT, function () {
        console.log(`Server run at ${PORT}`);
    })
} catch (err) {
    console.log("Mongodb connection err:", err);
}
