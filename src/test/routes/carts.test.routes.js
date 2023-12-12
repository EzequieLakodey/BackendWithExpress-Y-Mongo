import { Router } from 'express';
import { logger } from '../../middlewares/logger.js';

import CartsManagerMongo from '../../dao/controllers/mongo/carts.mongo.js';

const router = Router();
const mongoManager = new CartsManagerMongo();

router.get('/', async (req, res) => {
    try {
        logger.info('GET /api/carts-test/ - fetching all carts');
        const carts = await mongoManager.getAllCarts();
        res.json(carts);
    } catch (error) {
        logger.error(`GET /api/carts-test/ - ${error.message}`);
        res.status(500).send('There was an error getting the carts');
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = await mongoManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedProduct = await mongoManager.addProductToCart(
            cid,
            pid,
            quantity
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:cid/products/:pid/quantity', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await mongoManager.updateProductQuantity(
            cid,
            pid,
            quantity
        );
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await mongoManager.removeProductFromCart(cid, pid);
        res.json({ message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router as cartsTestRouter };
