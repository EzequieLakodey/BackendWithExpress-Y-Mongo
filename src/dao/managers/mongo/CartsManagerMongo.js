import { cartsModel } from '../../models/carts.model.js';
import mongoose from 'mongoose';
/* MODULES */

class CartsManagerMongo {
    constructor() {
        this.model = cartsModel;
    }

    async getAllCarts() {
        return this.model.find();
    }

    async createCart() {
        try {
            console.log('Creating new cart...');
            const newCart = await this.model.create({
                products: [],
            });
            console.log('New cart created ', newCart);
            return newCart;
        } catch (error) {
            console.log('Error creating new cart: ', error);
            throw error;
        }
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

export default CartsManagerMongo;
