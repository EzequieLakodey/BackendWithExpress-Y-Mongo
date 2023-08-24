import mongoose from 'mongoose';
import { cartsModel } from '../../models/carts.model.js';
import { productsModel } from '../../models/products.model.js';

/* MODULES */

class CartsManagerMongo {
    constructor() {
        this.model = cartsModel;
        this.productModel = productsModel;
    }

    async validateProduct(productId) {
        try {
            const product = await this.productModel.findById(productId);
        } catch (error) {
            console.log(error);
        }
    }

    async getTotalCarts() {
        return this.model.countDocuments();
    }

    async getAllCarts() {
        return this.model.find();
    }

    async createCart() {
        try {
            console.log('Creating new cart...');
            const newCart = await this.model.create({});
            console.log('New cart created ', newCart);
            return newCart;
        } catch (error) {
            console.log('Error creating new cart: ', error);
            throw error;
        }
    }

    async updateCart(cartId, products) {
        const cart = await this.getCart(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = products;
        await cart.save();
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.getCart(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const product = cart.products.find((p) => p.productId === productId);
        if (!product) {
            throw new Error('Product not found in cart');
        }
        product.quantity = quantity;
        await cart.save();
        return cart;
    }

    async removeAllProducts(cartId) {
        const cart = await this.getCart(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = [];
        await cart.save();
        return cart;
    }

    async getCart(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid Cart ID');
        }
        return this.model.findById(id);
    }

    async addProductToCart(cartId, productId, quantity) {
        this.validateProduct(productId);
        const cart = await this.getCart(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid Product ID');
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
                product: productId,

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
    async update() {}
}

export default CartsManagerMongo;
