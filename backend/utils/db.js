import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected sucessfully...");
    } catch (error) {
        // console.log(error);
        console.error("MongoDB connection error:", error);
    }
}
export default connectDB;