import mongoose from 'mongoose';
import { connectDB } from '../config/dbConnection.js';
import { productsModel } from '../dao/models/products.model.js';

connectDB().then(() => {
    productsModel
        .deleteMany({})
        .then(() => {
            ('Successfully deleted all products.');
            mongoose.disconnect();
        })
        .catch((error) => {
            console.error('Error deleting products:', error);
            mongoose.disconnect();
        });
});
