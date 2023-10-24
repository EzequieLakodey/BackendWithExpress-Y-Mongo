import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import ChatManagerMongo from '../dao/controllers/mongo/chat.mongo.js';
import { logger } from '../middlewares/logger.js';

const router = Router();
const chatManager = new ChatManagerMongo();

router.post('/', verifyToken, requireRole('user'), async (req, res) => {
    try {
        const { user, message } = req.body;
        logger.info(`POST /api/chats - user ${user} posted a new message`);
        const newMessage = await chatManager.addMessage(user, message);
        res.json(newMessage);
    } catch (error) {
        logger.error(`POST /api/chats - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        logger.info('GET /api/chats - fetching all messages');
        const messages = await chatManager.getMessages();
        res.json(messages);
    } catch (error) {
        logger.error(`GET /api/chats - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

export { router as chatRouter };
