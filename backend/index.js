import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRouter from "./routers/user.router.js"
import taskRouter from "./routers/task.router.js"

dotenv.config({});


const app = express();  

const PORT = process.env.PORT || 3000;

app.get('/',(_,res)=>{
    return res.status(200).json({
        message:"Comming from backend",
        success:true
    })
})

//middlerwares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOption = {
  origin: ['http://localhost:3000' , "https://enterprise-task-hub.onrender.com"],
  credentials: true
};
app.use(cors(corsOption));

app.use("/api/v1/user",userRouter);
app.use("/api/v1/task",taskRouter);
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server listen at port ${PORT}...`);
})