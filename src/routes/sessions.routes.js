import { Router } from 'express';
import { usersService } from '../dao/index.js';
import bcrypt from 'bcrypt';

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
        // Save the user to the database
        const result = await usersService.save(signupForm);
        res.render('login', { message: 'Usuario registrado' });
    } catch (error) {
        res.status(500).render('signup', { error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const loginForm = req.body;
        // Check if the user exists and validate the password
        const user = await usersService.getByEmail(loginForm.email);
        if (
            !user ||
            !(await bcrypt.compare(loginForm.password, user.password))
        ) {
            return res.status(401).render('login', {
                error: 'Credenciales inválidas',
            });
        }
        // Set the user info in the session
        req.session.userInfo = {
            first_name: user.first_name,
            email: user.email,
        };
        res.redirect('/profile');
    } catch (error) {
        res.status(500).render('signup', { error: error.message });
    }
});

const requireLogin = (req, res, next) => {
    if (!req.session.userInfo) {
        return res.redirect('/login');
    }
    next();
};

router.get('/profile', requireLogin, (req, res) => {
    const { first_name, email } = req.session.userInfo;
    res.render('profile', { first_name, email });
});

router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error)
            return res.status(500).render('profile', {
                user: req.session.userInfo,
                error: 'No se pudo cerrar la sesion',
            });
        res.redirect('/');
    });
});

export { router as sessionsRouter };
