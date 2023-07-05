import { manager } from './productsManager.js';
import express from 'express';
const app = express();

app.get('/products', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await manager.getProducts(+limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await manager.getProductsById(+pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: `Product not found` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function startServer() {
    try {
        app.listen(8080, () => console.log(`Server running on port 8080`));
    } catch (error) {
        console.log(`Error starting server ${error}`);
    }
}

startServer();
