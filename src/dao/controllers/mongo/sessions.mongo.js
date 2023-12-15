/* eslint-disable no-undef */
import { usersService } from '../../index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserDTO } from '../../../dto/users.dto.js';
import { authState } from '../../../middlewares/auth.js';
import { logger } from '../../../middlewares/logger.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import EmailService from '../../../services/email.services.js';
dotenv.config();

const emailService = new EmailService();

const renderLoginPage = (req, res) => {
    logger.info('GET /api/sessions/login - rendering login page');
    res.render('login');
};

const renderSignupPage = (req, res) => {
    logger.info('GET /api/sessions/signup - rendering signup page');
    res.render('signup');
};

const renderProfilePage = (req, res) => {
    logger.info('GET /api/sessions/profile - rendering profile page');
    req.headers.authorization;
    if (!req.user) {
        return res.redirect('/api/sessions/login');
    }
    // The verified user is available as req.user
    const { first_name, email } = req.user;
    // Render the view with the user data
    res.render('profile', { first_name, email });
};

const getCurrentUser = async (req, res) => {
    logger.info('GET /api/sessions/current - fetching current user');
    // The verified user is available as req.user
    const userDto = new UserDTO(req.user);
    res.json(userDto);
};

const register = async (req, res) => {
    req.body;
    try {
        logger.info('POST /api/sessions/signup - user attempting to sign up');
        req.body;
        const signupForm = req.body;
        // Check if the user already exists
        const user = await usersService.getByEmail(signupForm.email);
        if (user) {
            logger.warning(
                'POST /api/sessions/signup - user already registered'
            );

            return res.status(400).render('signup', {
                error: 'User already exists',
            });
        }
        // Hash the password
        if (!signupForm.password) {
            throw new Error('Password is required');
        }
        signupForm.password = await bcrypt.hash(signupForm.password, 10);
        // Set the role based on the email
        signupForm.role =
            signupForm.email === 'admin@coder.com' ? 'admin' : 'user';
        // Save the user to the database
        const savedUser = await usersService.save(signupForm);
        // Generate a JWT
        const token = jwt.sign(
            {
                _id: savedUser._id,
                first_name: savedUser.first_name,
                email: savedUser.email,
                role: savedUser.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        // Set the JWT in a cookie
        res.cookie('token', token, { httpOnly: true });
        logger.info('POST /api/sessions/signup - user registered successfully');
        res.status(200).json({ message: 'User registered' });
    } catch (error) {
        logger.error(`POST /api/sessions/signup - ${error.message}`);
        res.status(500).render('signup', { error: error.message });
    }
};

const login = async (req, res) => {
    req.body;
    try {
        logger.info('POST /api/sessions/login - user attempting to log in');
        const loginForm = req.body;
        const user = await usersService.getByEmail(loginForm.email);
        if (!user) {
            logger.error(
                'POST /api/sessions/login - No user found with the provided email'
            );
            return res
                .status(404)
                .send({ error: 'No user found with the provided email' });
        }
        if (!user) {
            logger.warning(
                'POST /api/sessions/login - invalid email or password'
            );
            return res
                .status(401)
                .render('login', { error: 'Invalid email or password' });
        }
        if (
            !loginForm.password ||
            !user.password ||
            !bcrypt.compareSync(loginForm.password, user.password)
        ) {
            logger.warning(
                'POST /api/sessions/login - invalid email or password'
            );
            return res
                .status(401)
                .render('login', { error: 'Invalid email or password' });
        }
        if (process.env.NODE_ENV !== 'test') {
            user.last_login = new Date();
            await usersService.update(user);
        }
        // Generate a JWT
        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        // Set the JWT in a cookie
        res.cookie('token', token, { httpOnly: true });
        logger.info('POST /api/sessions/login - user logged in successfully');
        res.redirect('/api/products/');
    } catch (error) {
        logger.error(`POST /api/sessions/login - ${error.message}`);
        res.status(500).send({ error: error.toString() });
    }
};

const logout = async (req, res) => {
    logger.info('POST /api/sessions/logout - user logged out');
    // Clear the JWT cookie
    res.clearCookie('token');
    authState.checkedUser = null;
    // Redirect to the login page
    res.redirect('/api/sessions/login');
};

const getUsers = async (req, res) => {
    const users = await usersService.getAll();
    const usersData = users.map((user) => ({
        first_name: user.first_name,
        email: user.email,
        role: user.role,
    }));
    res.json(usersData);
};

const deleteUsers = async (req, res, inactiveTime = 10 * 60 * 1000) => {
    try {
        // Take the time declared in the parameters
        const inactiveDate = new Date(Date.now() - inactiveTime);
        logger.info(
            `Deleting users who haven't logged in the last ${
                inactiveTime / 60000
            } minutes`
        );

        // Delete all users who haven't logged
        const deletedUsers = await usersService.deleteInactiveUsers(
            inactiveDate
        );
        logger.info(`Deleted ${deletedUsers.length} inactive users`);

        // change sendMail from async fn to promise because deleteUsers already is, and that was causing the mails not be sent along the rest of the process

        // Mapping the users that will be removed and then notified by the mail structure declared below
        const mailPromises = deletedUsers.map((user) => {
            // Send email to the user
            return emailService.sendEmail(user);
        });

        // Wait for all emails to be sent
        await Promise.all(mailPromises);

        logger.info(`Emails sent to ${deletedUsers.length} inactive users`);

        // Delete all users
        for (const user of deletedUsers) {
            await this.model.deleteOne({ _id: user._id });
        }

        logger.info(`Deleted ${deletedUsers.length} inactive users`);
    } catch (error) {
        logger.error('An error occurred while deleting users', error);
    }
};

const current = async (req, res) => {
    logger.info('GET /api/sessions/current - fetching current user');
    // The verified user is available as req.user
    const userDto = new UserDTO(req.user);
    res.json(userDto);
};

export default {
    register,
    login,
    current,
    logout,
    getUsers,
    deleteUsers,
    renderLoginPage,
    renderSignupPage,
    renderProfilePage,
    getCurrentUser,
};
