import mongoose from "mongoose";
import logger from "./src/logger/log logger.js";

export default async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        logger.info(`MongoDB connection Sucessfull`)
    }catch(err) {
        logger.error(`MongoDB connection error: ${err}`)
    }
}