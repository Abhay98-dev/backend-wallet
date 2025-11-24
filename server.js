import express from "express"
import dotenv from "dotenv"
import {sql} from "./config/db.js"
import rateLimiter from "./middleware/rateLimiter.js"
import transactionsRoute from "./routes/transactionsRoute.js"
import job from "./config/cron.js"

dotenv.config()
const PORT = process.env.PORT

const app=express()

if(process.env.NODE_ENV==="production") job.start()



async function initDB() {
    try{
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(100) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log("Database Initialized")
    }catch(err){
        console.error("Error initializing database: ",err)
        process.exit(1)//status code 1 means failure and 0 means success
    }  
}

app.use(express.json())
app.use(rateLimiter)

app.get("/api/health",(req,res)=>{
    res.status(200).json({status:"OK"})
})

app.use("/api/transactions",transactionsRoute)

initDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running on port: ",PORT)
    })
})
