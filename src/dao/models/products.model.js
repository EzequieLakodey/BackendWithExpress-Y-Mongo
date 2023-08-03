import mongoose from 'mongoose';

const productsCollection = 'products';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Clothing', 'Sports', 'Cosmetics'],
    },
    stock: {
        type: Number,
        required: true,
    },
});

export const productsModel = mongoose.model({
    productsCollection,
    productSchema,
});
