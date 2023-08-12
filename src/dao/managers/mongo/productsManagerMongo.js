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

    async getProducts({ limit = 10, page = 1, sort = 'name', query = {} }) {
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort,
        };

        // Convert page and limit to number
        limit = Number(limit);
        page = Number(page);

        // Calculate skip
        const skip = (page - 1) * limit;

        // Handle sorting and query
        const products = await this.model
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();

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
