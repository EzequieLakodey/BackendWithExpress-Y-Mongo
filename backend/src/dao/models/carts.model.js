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
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
