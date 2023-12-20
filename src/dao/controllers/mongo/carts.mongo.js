import mongoose from 'mongoose';
import { cartsModel } from '../../models/carts.model.js';
import { productsModel } from '../../models/products.model.js';
import { logger } from '../../../middlewares/logger.js';
import { usersModel } from '../../models/users.model.js';

/* MODULES */

class CartsManagerMongo {
    constructor() {
        this.model = cartsModel;
        this.productModel = productsModel;
    }

    async validateProduct(productId) {
        const product = await this.productModel.findById(productId);
        if (!product) {
            throw new Error('Product not found');
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
            logger.info('Creating new cart...');
            const newCart = await this.model.create({});
            logger.info(`New cart created with ID: ${newCart._id}`);
            return newCart;
        } catch (error) {
            logger.error(`Error creating new cart: ${error.message}`);
            throw error;
        }
    }

    async updateCart(cartId, newCartData) {
        logger.info(`Updating cart ${cartId} with new data ${JSON.stringify(newCartData)}`);
        let updatedCart = await this.model.findByIdAndUpdate(cartId, newCartData, { new: true });
        return updatedCart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getCart(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            const product = cart.products.find((p) => p.product.equals(productId));

            if (!product) {
                throw new Error('Product not found in cart');
            }
            product.quantity = quantity;
            logger.info(`Updating product ${productId} quantity in cart ${cartId} to ${quantity}`);
            await cart.save();
            return cart;
        } catch (error) {
            logger.error(`Error updating product quantity: ${error}`);
            throw error;
        }
    }

    async removeAllProducts(cartId) {
        const cart = await this.getCart(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = [];
        await cart.save();
        logger.info(`Removing all products from cart ${cartId}`);
        return cart;
    }

    async getCart(userId, error) {
        const user = await this.model.findById(userId).populate({
            path: 'cart',
            populate: {
                path: 'products.product',
            },
        });
        if (user) {
            logger.info('user.cart', user.cart);
            return user.cart;
        } else {
            logger.error('getCart carts.mongo User not found with id', userId, error);
        }
    }

    async addProductToCart(userId, productId, quantity) {
        this.validateProduct(productId);
        let user = await usersModel.findById(userId).populate('cart');
        if (!user) {
            logger.error('User not found with id', userId);

            throw new Error('User not found');
        }
        let cart = user.cart;
        if (!cart) {
            cart = await this.createCart();
            user.cart = cart._id;
            await user.save();
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid Product ID');
        }
        const productIndex = cart.products.findIndex((p) => p.product.equals(productId));
        if (productIndex !== -1) {
            // If the product exists in the cart, increment its quantity
            cart.products[productIndex].quantity += quantity;
        } else {
            // If the product does not exist in the cart, add it
            this.validateProduct(productId);
            logger.info(`Adding product ${productId} to cart ${cart._id} with quantity ${quantity}`);

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
        try {
            const cart = await this.getCart(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }

            const productIndex = cart.products.findIndex((p) => p.product.equals(id));
            if (productIndex === -1) {
                throw new Error('Product not found in the cart');
            }

            cart.products.splice(productIndex, 1);
            await cart.save();
            logger.info(`Removing product ${id} from cart ${cartId}`);
            return id;
        } catch (error) {
            logger.error(`Error removing product from cart: ${error}`);
            throw error;
        }
    }

    async update() {}
}

export const cartsManager = new CartsManagerMongo();
