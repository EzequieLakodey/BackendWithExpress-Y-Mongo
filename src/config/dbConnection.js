import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(`${config.mongo.url}/ecommerce`);
    } catch (error) {
        `Error connecting to the DB: ${error.message}`;
    }
};

connectDB();
