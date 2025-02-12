import app from './app.js'
import dovenv from 'dotenv'
import { connectDB } from './db/index.js'

dovenv.config({
    path: "./src/.env"
})

const PORT = process.env.PORT || 6000

connectDB()
.then(function () {
    app.listen(PORT, function () {
        console.log(`Server run at ${PORT}`);
    })
})
.catch(function (err) {
    console.log("Mongodb connection err:", err);
})
