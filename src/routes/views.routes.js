import { Router } from 'express';
import ProductsManager from '../dao/controllers//fs/productsManager.js';
/* MODULES */

const manager = new ProductsManager('products.json');
const router = Router();

router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.render('home', { products });
});

router.get('/realTimeProducts', async (req, res) => {
    const products = await manager.getProducts();
    res.render('realTimeProducts', { products });
});

router.get('/api/chats', (req, res) => {
    res.render('chat');
});

export { router as viewsRouter };
