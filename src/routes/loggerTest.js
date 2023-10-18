import { logger } from '../middlewares/logger';
import { Router } from 'express';

const router = Router();

router.get('/loggerTest', (req, res) => {
    logger.debug('Debug message');
    logger.http('HTTP message');
    logger.info('Info message');
    logger.warning('Warning message');
    logger.error('Error message');
    logger.fatal('Fatal message');
    res.send('Logged all levels');
});

export { router as loggerTestRoute };
