// models
import { productsModel } from '../../models/products.model.js';

/* MODULES */
class ProductsMongo {
    constructor() {
        this.model = productsModel;
    }

    async addProduct(product) {
        const newProduct = new this.model(product);
        let savedProduct;
        try {
            savedProduct = await newProduct.save();
        } catch (error) {
            console.log('Error while savng the product:', error);
            throw new Error('Error while saving the product');
        }
        this.emit('productAdded', savedProduct);
        return savedProduct;
    }

    async getProducts(limit) {
        let products = await this.model.find({});
        await this.model.find();
        if (limit) {
            return products.slice(0, limit);
        } else {
            return products;
        }
    }

    async getProductsById(id) {
        let product = await this.model.findById(id);
        return product;
    }

    async updateProduct(id, newProductData) {
        let updatedProduct = await this.model.findByIdAndUpdate(
            id,
            newProductData,
            { new: true }
        );
        return updatedProduct;
    }

    async deleteProduct(id) {
        let result = await this.model.findByIdAndDelete(id);
        return result;
    }
}

export default ProductsMongo;
