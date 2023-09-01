import { Router } from 'express';
import { checkUserAuthenticated, showLoginView } from '../middlewares/auth.js';
import ProductsManager from '../dao/managers/fileSystem/productsManager.js';
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

router.get('/chat', (req, res) => {
    res.render('chat');
});

export { router as viewsRouter };
