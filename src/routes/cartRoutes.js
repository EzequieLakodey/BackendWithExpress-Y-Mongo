import CartsManager from '../dao/managers/fileSystem/cartsManager.js';
import { Router } from 'express';
import { productsModel } from '../dao/models/products.model.js';
import { io } from '../servers.js';

const router = Router();

const manager = new CartsManager('carts.json');
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const skip = (page - 1) * limit;

        const pipeline = [];
        if (query) {
            pipeline.push({ $match: { category: query } });
        }
        if (sort) {
            pipeline.push({ $sort: { price: sort === 'asc' ? 1 : -1 } });
        }
        pipeline.push({ $skip: skip }, { $limit: limit });

        const products = await productsModel.aggregate(pipeline);
        res.json(products);
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

// DELETE /api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await manager.removeProductFromCart(cid, pid);
        res.json({ message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedProduct = await manager.addProductToCart(
            cid,
            pid,
            quantity
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router as cartRouter };
