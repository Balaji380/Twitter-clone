import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB is Connected")

    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

export default connectDB