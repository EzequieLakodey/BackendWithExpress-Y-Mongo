import jwt from 'jsonwebtoken';
import { secretKey } from '../config/jwtConfig.js';

export const checkUserAuthenticated = (req, res, next) => {
    if (req.session?.userInfo) {
        next();
    } else {
        res.redirect('/api/sessions/login'); // Updated path
    }
};

export const showLoginView = (req, res, next) => {
    if (req.session?.userInfo) {
        res.redirect('/api/sessions/profile'); // Updated path
    } else {
        next();
    }
};

export function verifyToken(req, res, next) {
    const token = req.cookies.token; // Get the token from the cookies
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Set the user data in req.user
        req.user = decoded;
        next();
    });
}
