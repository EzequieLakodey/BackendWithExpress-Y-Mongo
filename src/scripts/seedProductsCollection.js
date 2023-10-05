import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { connectDB } from '../config/dbConnection.js';
import { productsModel } from '../dao/models/products.model.js';

connectDB().then(() => {
    const numProducts = 100;
    const products = [];

    for (let i = 1; i <= numProducts; i++) {
        const product = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            code: `Code-${i}`,
            category: faker.commerce.department(),
            price: faker.commerce.price(),
            stock: Math.floor(Math.random() * 500) + 100,
        };
        products.push(product);
    }

    productsModel
        .insertMany(products)
        .then(() => {
            console.log(`Successfully inserted ${numProducts} products.`);
            mongoose.disconnect();
        })
        .catch((error) => {
            console.error('Error inserting products:', error);
            mongoose.disconnect();
        });
});
