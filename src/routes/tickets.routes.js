import { Router } from 'express';
import { ticketsMongo } from '../dao/controllers/mongo/tickets.mongo';

const router = Router();

router.post('/', async (req, res) => {
    const ticket = await ticketsMongo.createTicket(req.body);
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
