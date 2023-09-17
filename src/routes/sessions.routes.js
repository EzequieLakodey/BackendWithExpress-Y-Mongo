import { Router } from 'express';
import { usersService } from '../dao/index.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

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

router.post('/login', async (req, res) => {
    try {
        const loginForm = req.body;
        const user = await usersService.getByEmail(loginForm.email);
        if (!user || !bcrypt.compareSync(loginForm.password, user.password)) {
            return res
                .status(401)
                .render('login', { error: 'Invalid email or password' });
        }

        // Set the user role in the session from the user object
        req.session.userInfo = {
            ...req.session.userInfo,
            role: user.role,
            email: user.email,
            first_name: user.first_name,
        };

        res.redirect('/api/products');
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.toString() });
    }
});

export const requireLogin = (req, res, next) => {
    if (!req.session.userInfo) {
        return res.redirect('/api/sessions/login');
    }
    next();
};

router.get('/profile', requireLogin, (req, res) => {
    // After the first_name and email are retrieved from the session
    const { first_name, email } = req.session.userInfo;

    // Add a console log to print the first_name and email
    console.log(
        'first_name and email retrieved from session:',
        first_name,
        email
    );
    res.render('profile', { first_name, email });
});

router.post('/logout', (req, res, next) => {
    // Use Passport's req.logout() to log the user out
    req.logout(() => {
        // Redirect to the login page
        res.redirect('/api/sessions/login');
    });
});

// GitHub authentication route
router.get('/github', passport.authenticate('githubLoginStrategy'));

// GitHub authentication callback route
router.get(
    '/github-callback',
    passport.authenticate('githubLoginStrategy', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, store GitHub user data in session
        req.session.userInfo = {
            first_name: req.user.first_name, // Replace with the appropriate field from the GitHub user object
            email: req.user.email, // Replace with the appropriate field from the GitHub user object
        };

        // Redirect to '/api/products' after GitHub login
        res.redirect('/api/products');
    }
);

export { router as sessionsRouter };
