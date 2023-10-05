import mongoose from 'mongoose';
import { productsCollection } from '../../constants/index.js';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    code: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    stock: {
        type: Number,
        required: true,
    },
});

export const productsModel = mongoose.model(productsCollection, productSchema);
