import { Router } from 'express';
import passport from 'passport';
import { redirectIfAuthenticated, verifyToken } from '../middlewares/auth.js';
import jwt from 'jsonwebtoken';
import sessionsMongo from '../dao/controllers/mongo/sessions.mongo.js';

const router = Router();

router.get('/login', redirectIfAuthenticated, sessionsMongo.renderLoginPage);

router.get('/signup', redirectIfAuthenticated, sessionsMongo.renderSignupPage);

router.get('/profile', verifyToken, sessionsMongo.renderProfilePage);

router.get('/current', verifyToken, sessionsMongo.current);

router.get('/users', sessionsMongo.getUsers);

router.post('/signup', sessionsMongo.register);

router.post('/login', sessionsMongo.login);

router.post('/logout', sessionsMongo.logout);

router.post('/users', sessionsMongo.deleteUsers);

// GitHub authentication route
router.get(
    '/github',
    passport.authenticate('githubLoginStrategy', { session: false })
);

// GitHub authentication callback route
router.get(
    '/github-callback',
    passport.authenticate('githubLoginStrategy', {
        failureRedirect: '/login',
        session: false,
    }),
    (req, res) => {
        // Generate a JWT token for the user
        const token = jwt.sign(
            {
                _id: req.user._id,
                first_name: req.user.first_name,
                email: req.user.email,
                role: req.user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set the JWT token in a cookie

        res.cookie('token', token, { httpOnly: true });

        // Redirect to '/api/products' after GitHub login
        res.redirect('/api/products');
    }
);

export { router as sessionsRouter };
