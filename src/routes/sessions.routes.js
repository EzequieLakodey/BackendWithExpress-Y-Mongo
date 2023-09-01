import { Router } from 'express';
import { usersService } from '../dao/index.js';

/* MODULES */

const router = Router();
router.post('/signup', async (req, res) => {
    try {
        const signupForm = req.body;
        const user = await usersService.getByEmail(signupForm.email);
        if (user) {
            return res.render('signup', {
                error: 'el usuario ya esta registrado',
            });
        }
        const result = await usersService.save(signupForm);
        res.render('login', { message: 'usuario registrado' });
    } catch (error) {
        res.render('signup', { error: error.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const loginForm = req.body;
        const user = await usersService.getByEmail(loginForm.email);
        if (!user) {
            return res.render('login', {
                error: 'El usuario no se ha registrado',
            });
        }
        if (user.password === loginForm.password) {
            req.session.userInfo = {
                first_name: user.first_name,
                email: user.email,
            };
            res.redirect('/perfil');
        } else {
            return res.render('login', { error: 'Credenciales invalidas' });
        }
    } catch (error) {
        res.render('signup', { error: error.message });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error)
            return res.render('profile', {
                user: req.session.userInfo,
                error: 'No se pudo cerrar la sesion',
            });
        res.redirect('/');
    });
});

export { router as sessionsRouter };
