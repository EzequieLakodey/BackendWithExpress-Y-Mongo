import mongoose from 'mongoose';
import { config } from './config.js';
import { logger } from '../middlewares/logger.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongo.url);
        console.log(`App running on PORT: ${process.env.PORT}`);
    } catch (error) {
        logger.error(`Error connecting to the DB: ${error.message}`);
    }
};

connectDB();
