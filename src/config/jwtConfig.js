import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: '24h', // expires in 24 hours
    });
};
