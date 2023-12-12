import { connectDB } from '../config/dbConnection.js';
import UsersMongo from './controllers/mongo/users.mongo.js';

connectDB();
export const usersService = new UsersMongo();
