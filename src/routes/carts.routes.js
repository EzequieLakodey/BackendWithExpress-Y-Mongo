import CartsManagerMongo from '../dao/controllers/mongo/carts.mongo.js';
import { Router } from 'express';
import { io } from '../servers.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { UserDTO } from '../dto/users.dto.js';
import { Ticket } from '../dao/models/tickets.model.js';

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

router.post('/:cid/purchase', verifyToken, async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await manager.getCart(cid);
        if (!cart) {
            throw new Error('Cart not found');
        }

        // Get the user data from the request
        const user = req.user;
        // Create a new UserDTO with the user data
        const userDto = new UserDTO(user);

        // Initialize an array to store products that could not be purchased
        let unpurchasedProducts = [];

        // Initialize total amount
        let totalAmount = 0;

        // Iterate over each product in the cart
        for (let product of cart.products) {
            // Validate if there is enough stock for each product
            const productData = await this.productModel.findById(
                product.productId
            );
            if (productData.stock < product.quantity) {
                // If not enough stock, add product to unpurchasedProducts array
                unpurchasedProducts.push(product.productId);
            } else {
                // Subtract the purchased quantity from the product's stock
                productData.stock -= product.quantity;
                await productData.save();

                // Add the price of the purchased product to the total amount
                totalAmount += productData.price * product.quantity;
            }
        }

        // Create a new Ticket with the purchase data
        const ticket = new Ticket({
            code: Math.random().toString(36).substring(2, 15),
            purchase_datetime: Date.now(),
            amount: totalAmount,
            purchaser: user.email,
        });
        await ticket.save();

        // Remove purchased products from the cart
        cart.products = cart.products.filter((product) =>
            unpurchasedProducts.includes(product.productId)
        );
        await cart.save();

        // Return the unpurchased products if any
        if (unpurchasedProducts.length > 0) {
            res.json({
                message: 'Purchase completed with some products unavailable',
                user: userDto,
                unpurchasedProducts,
            });
        } else {
            res.json({
                message: 'Purchase completed successfully',
                user: userDto,
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
