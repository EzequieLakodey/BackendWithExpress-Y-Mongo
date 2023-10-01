import CartsManagerMongo from '../dao/managers/mongo/carts.mongo.js';
import { Router } from 'express';
import { io } from '../servers.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';

const router = Router();

const manager = new CartsManagerMongo();
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

        const carts = await manager.getAllCarts(pipeline);
        const totalCarts = await manager.getTotalCarts();
        const totalPages = Math.ceil(totalCarts / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        res.json({
            status: 'success',
            payload: carts,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage ? `/carts?page=${prevPage}` : null,
            nextLink: hasNextPage ? `/carts?page=${nextPage}` : null,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await manager.getCart(cid);
        if (cart) {
            res.render('cartsDetails', { cart: cart.toObject() });
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
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

router.post(
    '/:cid/products/:pid',
    verifyToken,
    requireRole('user'),
    async (req, res) => {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const { quantity } = req.body;
            const addedProduct = await manager.addProductToCart(
                cid,
                pid,
                quantity
            );
            io.emit('add-product-to-cart', { cid, pid, quantity });
            res.json(addedProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

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

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const updatedCart = await manager.updateCart(cid, products);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await manager.updateProductQuantity(
            cid,
            pid,
            quantity
        );
        res.json(updatedCart);
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

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedCart = await manager.removeAllProducts(cid);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router as cartsRouter };
