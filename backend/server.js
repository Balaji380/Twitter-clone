import express from "express"
import dotenv from "dotenv"
import authrouter from "./routes/auth.route.js"
import connectDb from  "./db/connectDB.js"
import cookieParser from "cookie-parser"


dotenv.config()

const app=express()
const port=process.env.PORT


app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authrouter)



app.listen(port,()=>{
    console.log(`Server is running on POrt ${port}`)
    connectDb();
})