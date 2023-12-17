import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserDTO } from '../../../dto/users.dto.js';
import { authState } from '../../../middlewares/auth.js';
import { logger } from '../../../middlewares/logger.js';
import dotenv from 'dotenv';
import { usersMongo } from './users.mongo.js';

dotenv.config();

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
        const user = await usersMongo.getByEmail(signupForm.email);
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
        const savedUser = await usersMongo.save(signupForm);
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
    try {
        req.body;
        logger.info('POST /api/sessions/login - user attempting to log in');
        const loginForm = req.body;
        const user = await usersMongo.getByEmail(loginForm.email);
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
            await usersMongo.update(user);
        }
        // Generate a JWT
        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                role: user.role,
            },
            // eslint-disable-next-line no-undef
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
    const users = await usersMongo.getAll();
    const usersData = users.map((user) => ({
        _id: user._id,
        first_name: user.first_name,
        email: user.email,
        role: user.role,
    }));
    if (req.isAdmin) {
        res.render('users', { users: usersData });
    } else {
        res.json(usersData);
    }
};

const deleteUsers = async (req, res) => {
    try {
        // Delete all users who haven't logged in the last 2 days
        const deletedUsers = await usersMongo.deleteInactiveUsers();

        // Send a response back to the client
        res.status(200).json({
            message: `Deleted ${deletedUsers.length} inactive users`,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const current = async (req, res) => {
    logger.info('GET /api/sessions/current - fetching current user');
    // The verified user is available as req.user
    const userDto = new UserDTO(req.user);
    res.json(userDto);
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    logger.info(`DELETE /api/sessions/users/${userId}, ${req.params}`);
    await usersMongo.deleteUser(userId);
    res.status(200).json({ message: 'User deleted' });
};

const modifyRole = async (req, res) => {
    const userId = req.params.id;
    const newRole = req.body.role;

    if (!newRole) {
        return res
            .status(400)
            .json({ error: 'Role not provided in the request body' });
    }

    logger.info(`PUT /api/sessions/users/${userId}, ${req.params} ${req.body}`);

    try {
        const user = await usersMongo.getById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ error: `User with ID ${userId} not found` });
        }

        user.role = newRole;
        await usersMongo.update(user);
        res.status(200).json({ message: 'Role updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { deleteUser, modifyRole };

export default {
    deleteUser,
    modifyRole,
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
