import cartsManager from '../cartManager.js';
import { Router } from 'express';

const router = Router();
const cartManager = new cartsManager('carts.json');

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCart(cid);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const addedProduct = await cartManager.addProductToCart(
            cid,
            pid,
            quantity
        );
        res.json(addedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router as cartRouter };
