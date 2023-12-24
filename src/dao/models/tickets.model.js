import mongoose from 'mongoose';
const ticketsCollection = 'tickets';

const TicketSchema = new mongoose.Schema({
    code: {
        required: true,
        type: String,
        unique: true,
        default: function () {
            // Generate unique code here
            return Math.random().toString(36).substr(2, 9);
        },
    },

    purchase_datetime: {
        required: true,
        type: Date,
        default: Date.now,
    },

    purchaser: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },

    amount: {
        required: true,
        type: Number,
    },

    total: {
        required: true,
        type: Number,
    },

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
            },
            quantity: Number,
            price: Number,
        },
    ],
});

export const Ticket = mongoose.model(ticketsCollection, TicketSchema);
