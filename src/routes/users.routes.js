import { Router } from 'express';
import { usersService } from '../dao/index.js';
import { verifyAdmin } from '../middlewares/auth.js';
const router = Router();

router.get('/', verifyAdmin, async (req, res, next) => {
    try {
        const users = await usersService.getAll();
        res.render('admin/users', { users });
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
});

export { router as usersRouter };
