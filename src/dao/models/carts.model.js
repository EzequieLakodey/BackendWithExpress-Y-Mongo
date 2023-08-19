import mongoose from 'mongoose';
import { cartsCollection } from '../../constants/index.js';

const cartsSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },

            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
