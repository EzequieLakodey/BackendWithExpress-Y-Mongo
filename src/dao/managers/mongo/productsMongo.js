import { productsModel } from '../../models/products.model.js';

export class ProductsMongo {
    constructor() {
        this.model = productsModel;
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
            if (!product[field]) {
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
    async addProduct(product) {
        this.validateProduct(product);
        const newProduct = new this.model({
            /* Assuming your product model has these fields */
            ...product, // Add here the product attributes, e.g., name, description, etc.
            code: product.code,
            is_deleted: false,
        });

        const result = await newProduct.save();
        this.emit('productAdded', result);

        return result;
    }

    async getProducts(limit) {
        await this.model.find();
        if (limit) {
            return this.products.slice(0, limit);
        } else {
            return this.products;
        }
    }

    async getProductsById(id) {
        await this.model.findById(id);
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
