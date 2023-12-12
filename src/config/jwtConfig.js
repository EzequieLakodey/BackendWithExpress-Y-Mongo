import jwt from 'jsonwebtoken';
import { logger } from '../middlewares/logger';

export const generateToken = (user, process) => {
    return jwt.sign(
        { first_name: user.first_name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        logger.info(`JWT_SECRET: ,${process.env.JWT_SECRET}`),
        {
            expiresIn: '24h', // expires in 24 hours
        }
    );
};
