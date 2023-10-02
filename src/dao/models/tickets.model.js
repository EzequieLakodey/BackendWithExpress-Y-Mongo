import mongoose from 'mongoose';
const ticketsCollection = 'tickets';

const TicketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            // Generate unique code here
            return Math.random().toString(36).substr(2, 9);
        },
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
});

export const Ticket = mongoose.model(ticketsCollection, TicketSchema);
