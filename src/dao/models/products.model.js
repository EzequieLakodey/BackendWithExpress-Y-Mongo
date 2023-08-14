import mongoose from 'mongoose';
const productsCollection = 'products';

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
        enum: ['Clothing', 'Sports', 'Cosmetics'],
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

export const productsModel = mongoose.model('products', productSchema);
