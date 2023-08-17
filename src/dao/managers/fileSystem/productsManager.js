/* eslint-disable quotes */

// file system
import fs from 'fs';

// utils
import path from 'path';
import { __dirname } from '../../../utils.js';

// events handler
import { EventEmitter } from 'events';

// uuid
import { v4 as uuidv4 } from 'uuid';

/* MODULES */
class ProductsManager extends EventEmitter {
    constructor(fileName) {
        super();
        this.products = [];
        this.idCounter = 1;
        this.path = path.join(__dirname, `/files/${fileName}`);
        this.readFromFile();
    }

    validateProduct(product, ignoreId) {
        if (typeof product !== 'object') {
            throw new Error('Product data must be an object');
        }
        const requiredFields = [
            'title',
            'description',
            'price',
            'code',
            'stock',
        ];
        for (let field of requiredFields) {
            if (
                !Object.prototype.hasOwnProperty.call(product, field) ||
                !product[field]
            ) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        if (
            this.products.some(
                (p) => p.code === product.code && p.id !== ignoreId
            )
        ) {
            throw new Error('Product code already exists');
        }
    }

    async readFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return data ? JSON.parse(data) : [];
            const json = JSON.parse(data);
            if (Array.isArray(json)) {
                this.products = json;
                this.idCounter =
                    this.products.length > 0
                        ? this.products[this.products.length - 1].id + 1
                        : 1;
            }
        } catch (error) {
            console.error("Can't read disk data", error);
            throw new Error("Can't read disk data");
        }
    }

    async writeToFile() {
        const jsonString = JSON.stringify(this.products, null, 2);

        try {
            await fs.promises.writeFile(this.path, jsonString);
            console.log('Data written');
        } catch (error) {
            console.log('Error writing file', error);
            throw new Error('Error writing file');
        }
    }

    async addProduct(product) {
        this.validateProduct(product);
        if (this.products.some((p) => p.code === product.code)) {
            throw new Error('Product code already exists');
        }
        const newProduct = {
            id: uuidv4(),
            ...product,
        };
        this.products.push(newProduct);
        await this.writeToFile();
        this.emit('productAdded', newProduct);
        return newProduct;
    }

    async getProducts(limit) {
        await this.readFromFile();
        if (limit) {
            return this.products.slice(0, limit);
        } else {
            return this.products;
        }
    }

    async getProductsById(id) {
        await this.readFromFile();
        const numId = Number(id);
        const product = this.products.find((p) => p.id === numId);
        if (!product) {
            return null;
        }
        return product;
    }
    async updateProduct(id, newProductData) {
        const numId = Number(id);
        const index = this.products.findIndex((p) => p.id === numId);
        if (index === -1) {
            console.log('Inexistent product');
            return null;
        }

        this.validateProduct(newProductData, numId);
        this.products[index] = { ...this.products[index], ...newProductData };
        await this.writeToFile();
        return this.products[index];
    }

    async deleteProduct(id) {
        const numId = Number(id);
        const lengthBeforeRemoval = this.products.length;
        this.products = this.products.filter((p) => p.id !== numId);
        if (this.products.length === lengthBeforeRemoval) {
            console.log('Inexistent product');
            return null;
        }
        await this.writeToFile();
        console.log('Product deleted succesfully');
        this.emit('productDeleted', id);
        return id;
    }
}

export default ProductsManager;
