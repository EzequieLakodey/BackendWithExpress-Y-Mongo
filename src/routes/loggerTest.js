import { logger } from '../middlewares/logger.js';
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    logger.debug('This is a debug log');
    logger.http('This is a http log');
    logger.info('This is an info log');
    logger.warning('This is a warning log');
    logger.error('This is an error log');
    logger.fatal('This is a fatal log');
    res.send('Check your logs');
});

export { router as loggerTestRoute };
