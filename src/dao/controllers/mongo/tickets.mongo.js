import { Ticket } from '../../models/tickets.model';

class TicketsMongo {
    constructor() {
        this.model = Ticket;
    }

    async createTicket(ticketData) {
        const ticket = new Ticket(ticketData);
        return await ticket.save();
    }

    async getAllTickets() {
        return await Ticket.find({});
    }

    async getTicketById(id) {
        return await Ticket.findById(id).populate('purchaser');
    }
}

export const ticketsMongo = new TicketsMongo();
