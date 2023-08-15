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

        return savedProduct;
    }

    async getProducts({ limit = 10, page = 1, sort = 'name', query = {} }) {
        // Convert page and limit to number
        limit = Number(limit);
        page = Number(page);

        // Calculate skip
        const skip = (page - 1) * limit;

        // Handle sorting
        let sortObj = {};
        sortObj[sort] = 1; // 1 for ascending

        // Perform query
        const pipeline = [
            { $match: query },
            { $sort: sortObj },
            { $skip: skip },
            { $limit: limit },
        ];

        const products = await this.model.aggregate(pipeline).exec();

        return products;
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
