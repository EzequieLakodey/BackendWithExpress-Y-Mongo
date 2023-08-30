import mongoose from 'mongoose';
import { connectDB } from '../config/dbConnection.js';
import { productsModel } from '../dao/models/products.model.js'; // Make sure the path is correct

// Delete all products
connectDB().then(() => {
    productsModel
        .deleteMany({})
        .then(() => {
            console.log('Successfully deleted all products.');
            mongoose.disconnect();
        })
        .catch((error) => {
            console.error('Error deleting products:', error);
            mongoose.disconnect();
        });
});
