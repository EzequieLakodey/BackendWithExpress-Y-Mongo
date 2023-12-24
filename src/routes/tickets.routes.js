import { Router } from 'express';
import { ticketsMongo } from '../dao/controllers/mongo/tickets.mongo.js';
import { verifyToken } from '../middlewares/auth.js';
import { logger } from '../middlewares/logger.js';

const router = Router();

router.post('/', verifyToken, async (req, res) => {
    logger.info('POST /api/tickets/purchase - confirming purchase');
    const ticket = await ticketsMongo.createTicket(req);
    res.json(ticket);
});

router.get('/', async (req, res) => {
    const tickets = await ticketsMongo.getAllTickets();
    res.json(tickets);
});

router.get('/:id', async (req, res) => {
    const ticket = await ticketsMongo.getTicketById(req.params.id);
    res.json(ticket);
});

export { router as ticketsRouter };
