import fs from 'fs';

class cartManager {
    constructor(filePath) {
        this.carts = [];
        this.idCounter = 1;
        this.path = filePath;
        this.readFromFile();
    }

    async readFromFile() {
        try {
            const data = await fs.promises.readFile(this.path);
            try {
                const json = JSON.parse(data);
                if (Array.isArray(json)) {
                    this.products = json;
                    this.idCounter =
                        this.products.length > 0
                            ? this.products[this.products.length - 1].id + 1
                            : 1;
                }
            } catch (err) {
                console.error('Error parsing JSON:', err);
            }
        } catch (error) {
            throw new Error(`Can't read disk data ${error}`);
        }
    }

    async writeToFile() {
        const jsonString = JSON.stringify(this.products, null, 2);

        if (typeof jsonString !== 'string') {
            throw new Error('Attempted to write non-string data to file');
        }

        try {
            await fs.promises.writeFile(this.path, jsonString);
            console.log('Data written');
        } catch (error) {
            console.log(`Error writing file ${error}`);
        }
    }

    async createCart() {
        const newCart = {
            id: this.idCounter++,
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

    async addProductToCart(cartId, productId, quantity) {
        const cart = this.carts.find((c) => c.id === cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const product = {
            id: productId,
            quantity: quantity,
        };
        cart.products.push(product);
        await this.writeToFile();
        return product;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = this.carts.find((c) => c.id === cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const productIndex = cart.products.findIndex((p) => p.id === productId);
        if (productIndex === -1) {
            throw new Error('Product not found in the cart');
        }
        cart.products.splice(productIndex, 1);
        await this.writeToFile();
        return productId;
    }
}

export default cartManager;
