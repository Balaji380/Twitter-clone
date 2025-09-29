import mongoose from "mongoose";

const connectMongoDB=async()=>{
    try {
        
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB is Connected")

    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

export default connectMongoDB