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

    async readFromFile() {
        try {
            const data = await fs.promises.readFile(this.path);
            const json = JSON.parse(data);
            if (Array.isArray(json)) {
                this.products = json;
                this.idCounter =
                    this.products.length > 0
                        ? this.products[this.products.length - 1].id + 1
                        : 1;
            }
        } catch (error) {
            console.log`Can't read disk data ${error}`;
        }
    }

    writeToFile() {
        try {
            const data = JSON.stringify(this.products, null, 4);
            fs.writeFileSync(this.path, data);
        } catch (error) {
            console.log(`Error writing file ${error}`);
        }
    }

    addProduct(product) {
        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            !product.stock
        ) {
            console.log('All field are required');
            return null;
        }
        if (this.products.some((p) => p.code === product.code)) {
            console.log('Product code already exists');
            return null;
        }

        const newProduct = {
            id: this.idCounter++,
            ...product,
        };
        this.products.push(newProduct);
        this.writeToFile();
        return newProduct;
    }

    getProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        } else {
            return this.products;
        }
    }

    getProductsById(id) {
        const product = this.products.find((p) => p.id === id);

        if (!product) {
            console.log('Not found');
            return null;
        }

        return product;
    }

    updateProduct(id, newProductData) {
        const index = this.products.findIndex((p) => p.id === id);

        if (index === -1) {
            console.log('Inexistent product');
            return null;
        }

        this.products[index] = { ...this.products[index], ...newProductData };
        this.writeToFile();
        return this.products[index];
    }

    deleteProduct(id) {
        const lengthBeforeRemoval = this.products.length;
        this.products = this.products.filter((p) => p.id !== id);

        if (this.products.length === lengthBeforeRemoval) {
            console.log('Inexistent product');
            return null;
        }

        this.writeToFile();
        console.log('Product deleted succesfully');
        return id;
    }
}

const productsJsonPath = path.join(__dirname, './fs/products.json');

// Creation
export const manager = new productManager(productsJsonPath);
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
manager.addProduct(newProduct);

// Searching
console.log(manager.getProductsById(1));
console.log(manager.getProductsById(2));

// Update
manager.updateProduct(1, { price: 300, description: 'Updated description' });
console.log(manager.getProducts());

// Deleting
manager.deleteProduct(1);
console.log(manager.getProducts());

// Creation
const otherProduct = {
    title: 'undefined',
    description: 'undefined',
    price: 'undefined',
    thumbnail: 'undefined',
    code: 'undefined',
    stock: 'undefined',
};

// Addition
manager.addProduct(otherProduct);

// Update
manager.updateProduct(1, {
    title: 'Iphone 13 max',
    description: 'Apple is trash',
    price: 'So expensive',
    thumbnail: 'Search in google',
    code: 'omega or alpha idk',
    stock: 'ask steve jobs',
});

export default productManager;
