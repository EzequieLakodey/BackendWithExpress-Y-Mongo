import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import ChatManagerMongo from '../dao/controllers/mongo/chat.mongo.js';

const router = Router();
const chatManager = new ChatManagerMongo();

router.post('/message', verifyToken, requireRole('user'), async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = await chatManager.addMessage(user, message);
        res.json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/messages', async (req, res) => {
    try {
        const messages = await chatManager.getMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router as chatRouter };
