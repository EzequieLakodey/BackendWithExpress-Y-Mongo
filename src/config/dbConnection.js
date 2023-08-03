import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongo.url);
        console.log('database connected succesfully');
    } catch (error) {
        console.log(`Error while connecting to the database ${error.message}`);
    }
};
