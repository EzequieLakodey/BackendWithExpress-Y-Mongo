import { connectDB } from '../config/dbConnection.js';
import UsersMongo from './controllers/mongo/usersRepository.js';

connectDB();
export const usersService = new UsersMongo();
