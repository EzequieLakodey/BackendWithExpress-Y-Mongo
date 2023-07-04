import productManager from './productsManager.js';
import { manager } from './productsManager.js';
import express from 'express';
const app = express();

app.get('/products', (req, res) => {
    const { limit } = req.query;
    const products = manager.getProducts(+limit);

    res.json(products);
});

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await manager.getProductsById(+pid);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: `Product not found` });
    }
});

app.listen(8080, () => console.log`Server runnin on port 8080`);
