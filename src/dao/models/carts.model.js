import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    products: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            productId: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
