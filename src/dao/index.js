import { connectDB } from '../config/dbConnection.js';
import UsersMongo from './managers/mongo/usersRepository.js';

connectDB();
export const usersService = new UsersMongo();
