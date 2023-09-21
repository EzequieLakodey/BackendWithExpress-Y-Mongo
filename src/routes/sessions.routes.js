import { Router } from 'express';
import { usersService } from '../dao/index.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    try {
        const signupForm = req.body;
        // Check if the user already exists
        const user = await usersService.getByEmail(signupForm.email);
        if (user) {
            return res.status(400).render('signup', {
                error: 'El usuario ya está registrado',
            });
        }
        // Hash the password
        signupForm.password = await bcrypt.hash(signupForm.password, 10);
        // Set the role based on the email
        signupForm.role =
            signupForm.email === 'admin@coder.com' ? 'admin' : 'user';
        // Save the user to the database
        await usersService.save(signupForm);
        res.render('login', { message: 'Usuario registrado' });
    } catch (error) {
        res.status(500).render('signup', { error: error.message });
    }
});

import jwt from 'jsonwebtoken';

// ...

router.post('/login', async (req, res) => {
    try {
        const loginForm = req.body;
        const user = await usersService.getByEmail(loginForm.email);
        if (!user || !bcrypt.compareSync(loginForm.password, user.password)) {
            return res
                .status(401)
                .render('login', { error: 'Invalid email or password' });
        }

        // Generate a JWT
        const token = jwt.sign(
            {
                _id: user._id,
                first_name: user.first_name,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set the JWT in a cookie
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/api/products');
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.toString() });
    }
});

router.get('/current', verifyToken, (req, res) => {
    // The verified user is available as req.user
    const { first_name, email } = req.user;
    res.json({ first_name, email });
});

router.get('/profile', (req, res) => {
    // Verify the JWT
    const token = req.cookies.token;
    let userData;
    try {
        userData = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error('Invalid token:', error);
        return res.status(401).send('Invalid token');
    }

    // Extract the user data from the JWT
    const { first_name, email } = userData;

    // Render the view with the user data
    res.render('profile', { first_name, email });
});

// GitHub authentication route
router.get(
    '/github',
    passport.authenticate('githubLoginStrategy', { session: false })
);

// GitHub authentication callback route
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

// Add the /current route to get the current user based on the token
router.get(
    '/current',
    passport.authenticate('current', { session: false }),
    (req, res) => {
        const { first_name, email } = req.user;
        res.json({ first_name, email });
    }
);

router.post('/logout', (req, res) => {
    // Clear the JWT cookie
    res.clearCookie('token');

    // Redirect to the login page
    res.redirect('/api/sessions/login');
});

export { router as sessionsRouter };
