import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(
        { first_name: user.first_name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        {
            expiresIn: '24h', // expires in 24 hours
        }
    );
};
