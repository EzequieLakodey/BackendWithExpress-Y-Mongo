import express from 'express';
import ProductsManager from '../productsManager.js';
const manager = new ProductsManager('products.json');

const router = express.Router();
router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.render('home', { products });
});
router.get('/realTimeProducts', async (req, res) => {
    const products = await manager.getProducts();
    res.render('realTimeProducts', { products });
});
export default router;
