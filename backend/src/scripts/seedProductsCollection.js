import mongoose from 'mongoose';
import { connectDB } from '../config/dbConnection.js';
import { productsModel } from '../dao/models/products.model.js'; // Make sure the path is correct

// Generate and insert products
connectDB().then(() => {
    const numProducts = 100; // Number of products to generate
    const products = [];

    for (let i = 1; i <= numProducts; i++) {
        const product = {
            title: `Product ${i}`,
            description: `Description for Product ${i}`,
            code: `Code-${i}`,
            category: 'Sports', // Modify as needed
            price: Math.floor(Math.random() * 1000) + 500, // Random price between 500 and 1500
            stock: Math.floor(Math.random() * 500) + 100, // Random stock between 100 and 600
        };
        products.push(product);
    }

    // Insert products into the database
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
