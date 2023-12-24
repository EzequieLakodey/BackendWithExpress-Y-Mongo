import { Ticket } from '../../models/tickets.model.js';
import { usersMongo } from './users.mongo.js';
import { logger } from '../../../middlewares/logger.js';

class TicketsMongo {
    constructor() {
        this.model = Ticket;
    }

    async createTicket(req) {
        try {
            // Get the user's information
            const userData = req.user;

            // Get the user's cart
            const userCart = await usersMongo.getCart(userData._id);

            let amount = 0;
            let total = 0;
            const products = userCart.products.map((p) => {
                console.log(p);
                amount += p.quantity;
                total += p.product.price * p.quantity;
                return {
                    product: p.p,
                    quantity: p.quantity,
                    price: p.product.price,
                };
            });

            // Prepare the ticket data
            const ticketData = {
                purchaser: userData._id,
                amount: amount,
                total: total,
                products: products,
            };

            // Create the ticket
            const ticket = new Ticket(ticketData);

            // Save the ticket
            const savedTicket = await ticket.save();

            // Clear the user's cart
            userCart.products = [];
            await userCart.save();

            // Return the saved ticket
            return savedTicket;
        } catch (error) {
            logger.error(`Error creating ticket: ${error}`);
        }
    }

    async getAllTickets() {
        return await Ticket.find({});
    }

    async getTicketById(id) {
        return await Ticket.findById(id).populate('purchaser');
    }
}

export const ticketsMongo = new TicketsMongo();
