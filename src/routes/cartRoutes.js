import CartManager from '../cartManager.js';
import { Router } from 'express';
import { io } from '../servers.js';

const router = Router();
const manager = new CartManager('carts.json');
router.get('/', async (req, res) => {
    try {
        const carts = await manager.getAllCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const newCart = await manager.createCart();
        io.emit('new-cart', newCart);
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:cid', async (req, res) => {
    try {
        const cid = Number(req.params.cid);
        const cart = await manager.getCart(cid);
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
        const cid = Number(req.params.cid);
        const pid = req.params.pid;
        const { quantity } = req.body;
        const addedProduct = await manager.addProductToCart(cid, pid, quantity);
        io.emit('add-product-to-cart', { cid, pid, quantity });
        res.json(addedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export { router as cartRouter };
