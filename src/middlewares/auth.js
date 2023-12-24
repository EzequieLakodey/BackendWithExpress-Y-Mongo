import jwt from 'jsonwebtoken';
import { logger } from './logger.js';
import { usersMongo } from '../dao/controllers/mongo/users.mongo.js';
import { cartsManager } from '../dao/controllers/mongo/carts.mongo.js';
import { usersModel } from '../dao/models/users.model.js';

export const authState = {
    checkedUser: null,
};

export function verifyToken(req, res, next) {
    let token = req.cookies.token; // Get the token from the cookies

    // If no token in cookies, check the Authorization header
    if (!token && req.headers.authorization) {
        // Format of Authorization header: "Bearer TOKEN"
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Fetch the user's information from the database
        const user = await usersMongo.getById(decoded._id);
        if (!user) {
            // Clear the token and redirect to login page
            res.clearCookie('token');
            return res.redirect('/login');
        }

        // Set the user data in req.user
        req.user = user;
        authState.checkedUser = req.user;
        logger.info(`User authenticated: ${req.user.email}`);
        next();
    });
}

export function requireRole(role) {
    return function (req, res, next) {
        if (req.user && req.user.role === role) {
            logger.info(`User role verified: ${req.user.role}`);
            next();
        } else {
            res.status(403).send('Forbidden');
        }
    };
}

export function verifyAdmin(req, res, next) {
    req.isAdmin = req.user && req.user.role === 'admin';
    next();
}

export function redirectIfAuthenticated(req, res, next) {
    authState.checkedUser ? res.redirect('/api/products/') : next();
}

export function verifyPremium(req, res, next) {
    req.isPremium = req.user && req.user.premium;
    next();
}

export async function refreshUser(req, res, next) {
    if (req.user) {
        const freshUser = await usersMongo.getById(req.user._id);
        req.user.role = freshUser.role;
        req.user.premium = freshUser.premium;
    }
    next();
}
