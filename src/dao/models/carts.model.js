import mongoose from 'mongoose';
import { cartsCollection } from '../../constants/index.js';

/* modules */

const cartsSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
            },
            quantity: Number,
        },
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        unique: true,
    },
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
