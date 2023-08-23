import mongoose from 'mongoose';
import { cartsCollection } from '../../constants/index.js';

/* modules */

const cartsSchema = new mongoose.Schema({
    products: {
        type: [],
        default: [],
    },
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
