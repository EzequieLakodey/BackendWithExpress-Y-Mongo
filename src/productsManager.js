import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

class productManager {
    constructor(filePath) {
        this.products = [];
        this.idCounter = 1;
        this.path = filePath;
        this.readFromFile();
    }
    validateProduct(product) {
        if (typeof product !== 'object') {
            throw new Error('Product data must be an object');
        }
        const requiredFields = [
            'title',
            'description',
            'price',
            'thumbnail',
            'code',
            'stock',
        ];
        for (let field of requiredFields) {
            if (!product[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
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

    async addProduct(product) {
        this.validateProduct(product);
        if (this.products.some((p) => p.code === product.code)) {
            throw new Error('Product code already exists');
        }
        const newProduct = {
            id: this.idCounter++,
            ...product,
        };
        this.products.push(newProduct);
        await this.writeToFile()
            .then(() => {
                console.log(`Data written succesfully`);
            })
            .catch((error) => console.log(`Error written file ${error}`));
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
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            return null;
        }
        return product;
    }
    async updateProduct(id, newProductData) {
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) {
            console.log('Inexistent product');
            return null;
        }
        this.products[index] = { ...this.products[index], ...newProductData };
        await this.writeToFile();
        return this.products[index];
    }

    async deleteProduct(id) {
        const lengthBeforeRemoval = this.products.length;
        this.products = this.products.filter((p) => p.id !== id);
        if (this.products.length === lengthBeforeRemoval) {
            console.log('Inexistent product');
            return null;
        }
        await this.writeToFile();
        console.log('Product deleted succesfully');
        return id;
    }
}

// Creation
export const manager = new productManager(
    path.join(__dirname, 'products.json')
);
console.log(manager.getProducts());

const newProduct = {
    title: 'producto prueba',
    description: 'Este es un producto de prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
};

// Addition
manager.addProduct(newProduct);
console.log(manager.getProducts());

// Searching
console.log(manager.getProductsById(1));
console.log(manager.getProductsById(2));

// Updating
manager.updateProduct(1, { price: 300, description: 'Updated description' });
console.log(manager.getProducts());

// Deleting
manager.deleteProduct(1);
console.log(manager.getProducts());

// Creation
const otherProduct = {
    title: 'Product Name',
    description: 'Product Description',
    price: 100,
    thumbnail: 'product-image.jpg',
    code: 'ABC123',
    stock: 10,
};

// Addition
manager.addProduct(otherProduct);

// Updating
manager.updateProduct(1, {
    title: 'Iphone 13 max',
    description: 'Apple is trash',
    price: 'So expensive',
    thumbnail: 'Search in google',
    code: 'omega or alpha idk',
    stock: 'ask steve jobs',
});

export default productManager;
