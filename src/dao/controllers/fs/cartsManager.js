/* eslint-disable quotes */

// file system
import fs from 'fs';

// utils
import path from 'path';
import { __dirname } from '../../../utils.js';

// uuid
import { v4 as uuidv4 } from 'uuid';

/* MODULES */

class CartsManager {
    constructor(fileName) {
        this.carts = [];
        this.idCounter = 1;
        this.path = path.join(__dirname, `/files/${fileName}`);
        this.readFromFile();
    }

    async readFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return data ? JSON.parse(data) : [data];
            const json = JSON.parse(data);
            if (Array.isArray(json)) {
                this.carts = json;
                this.idCounter =
                    this.carts.length > 0
                        ? this.carts[this.carts.length - 1].id + 1
                        : 1;
            }
        } catch (error) {
            console.error("Can't read disk data", error);
            throw new Error("Can't read disk data");
        }
    }

    async writeToFile() {
        const jsonString = JSON.stringify(this.carts, null, 2);
        try {
            await fs.promises.writeFile(this.path, jsonString);
            ('Data written');
        } catch (error) {
            console.error('Error writing file', error);
            throw new Error('Error writing file');
        }
    }

    async getAllCarts() {
        return this.carts;
    }

    async createCart() {
        const newCart = {
            id: uuidv4(),
            products: [],
        };
        this.carts.push(newCart);
        await this.writeToFile();
        return newCart;
    }

    async getCart(id) {
        const cart = this.carts.find((c) => c.id === id);
        if (!cart) {
            return null;
        }
        return cart;
    }

    validateProduct(cart, productId) {
        if (cart.products.some((p) => p.id === productId)) {
            throw new Error('Product already exists in the cart');
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = this.carts.find((c) => c.id === cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        this.validateProduct(cart, productId);

        const product = {
            id: uuidv4(),
            productId: productId,
            quantity: quantity,
        };
        cart.products.push(product);
        await this.writeToFile();
        return product;
    }

    async removeProductFromCart(cartId, id) {
        const cart = this.carts.find((c) => c.id === cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const productIndex = cart.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            throw new Error('Product not found in the cart');
        }
        cart.products.splice(productIndex, 1);
        await this.writeToFile();
        return id;
    }
}

export default CartsManager;
