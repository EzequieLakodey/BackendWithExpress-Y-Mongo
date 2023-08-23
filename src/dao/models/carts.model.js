import mongoose from 'mongoose';
import { cartsCollection } from '../../constants/index.js';

/* modules */

const cartsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    products: {
        type: [],
        default: [],
    },
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
