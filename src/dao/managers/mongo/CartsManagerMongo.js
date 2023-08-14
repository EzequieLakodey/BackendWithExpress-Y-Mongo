import Cart from '../../models/carts.model.js';
import mongoose from 'mongoose';

class CartManagerMongo {
    constructor() {
        this.model = Cart;
    }

    async getAllCarts() {
        return this.model.find();
    }

    async createCart() {
        const newCart = new this.model({
            id: mongoose.Types.ObjectId().toString(),
            products: [],
        });
        await newCart.save();
        return newCart;
    }

    async getCart(id) {
        return this.model.findById(id);
    }

    async validateProduct(cart, productId) {
        if (cart.products.some((p) => p.productId === productId)) {
            throw new Error('Product already exists in the cart');
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.getCart(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const productIndex = cart.products.findIndex(
            (p) => p.productId === productId
        );
        if (productIndex !== -1) {
            // If the product exists in the cart, update its quantity
            cart.products[productIndex].quantity = quantity;
        } else {
            // If the product does not exist in the cart, add it
            this.validateProduct(cart, productId);

            const product = {
                id: mongoose.Types.ObjectId().toString(),
                productId,
                quantity,
            };
            cart.products.push(product);
        }

        await cart.save();
        return cart;
    }

    async removeProductFromCart(cartId, id) {
        const cart = await this.getCart(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const productIndex = cart.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            throw new Error('Product not found in the cart');
        }

        cart.products.splice(productIndex, 1);
        await cart.save();
        return id;
    }
}

export default CartManagerMongo;
