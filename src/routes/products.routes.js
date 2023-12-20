import { productsManager } from '../dao/controllers/mongo/products.mongo.js';
import { emailService } from '../services/email.services.js';
import { cartsManager } from '../dao/controllers/mongo/carts.mongo.js';
import { usersMongo } from '../dao/controllers/mongo/users.mongo.js';
import { Router } from 'express';
import { verifyToken, requireRole, verifyPremium } from '../middlewares/auth.js';
import { logger } from '../middlewares/logger.js';
import { cartsModel } from '../dao/models/carts.model.js';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    let first_name, email;

    if (req.user) {
        first_name = req.user.first_name;
        email = req.user.email;
    }

    try {
        logger.info('GET /api/products - fetching all products');
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const products = await productsManager.getProducts({
            page: page,
            limit: size,
        });
        const total = await productsManager.getTotalProducts();
        const pages = Math.ceil(total / size);
        const prevPage = page - 1 > 0 ? page - 1 : null;
        const nextPage = page + 1 <= pages ? page + 1 : null;

        if (process.env.NODE_ENV === 'test') {
            return res.json(products);
        } else if (req.user?.role === 'admin') {
            res.render('products_manager', {
                products,
                prevPage,
                nextPage,
                first_name,
                email,
                user: req.user,
            });
        } else {
            res.render('products', {
                products,
                prevPage,
                nextPage,
                first_name,
                email,
                user: req.user,
            });
        }
    } catch (error) {
        logger.error(`GET /api/products - ${error.message}`);
        res.status(500).send('There was an error getting the products');
    }
});

router.get('/:pid', verifyToken, async (req, res) => {
    try {
        const { pid } = req.params;
        logger.info(`GET /api/products/:pid - fetching product ${pid}`);
        const product = await productsManager.getProductsById(pid);
        if (product) {
            // Fetch the cart associated with the current user
            const user = req.user;
            if (!user) {
                throw new Error('User not authenticated');
            }
            console.log(`User's cart ID: ${user.cart}`);
            const cart = await cartsModel.findById(user.cart);
            console.log(`Fetched cart: ${cart}`);
            if (!cart) {
                throw new Error('Cart not found');
            }

            // Pass the product and cart to the template
            res.render('productsDetails', { product: product.toObject(), cart: cart.toObject(), user: req.user });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        logger.error(`GET /api/products/:pid - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        logger.info('POST /api/products - posting product');
    } catch (error) {
        logger.error(`POST /api/products - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:pid', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const { pid } = req.params;
        logger.info(`PUT /api/products/:pid - updating product ${pid}`);
    } catch (error) {
        logger.error(`PUT /api/products/:pid - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:pid', verifyToken, requireRole('admin'), verifyPremium, async (req, res) => {
    try {
        const { pid } = req.params;
        logger.info(`DELETE /api/products/:pid - deleting product ${pid}`);

        const product = await productsManager.getProductsById(pid);
        if (!product) {
            logger.error('DELETE /api/products/:pid - Product not found');
            return res.status(404).json({ error: 'Product not found' });
        }
        const carts = await cartsManager.getAllCarts();
        for (const cart of carts) {
            // Check if the product is in the cart
            const productInCart = cart.products.find((p) => p.product.equals(pid));
            if (productInCart) {
                if (!cart.userId) {
                    logger.error(`Cart with ID ${cart._id} has no user ID`);
                    continue;
                }
                // If the product is in the cart, get the cart's owner
                const user = await usersMongo.getById(cart.userId);
                // If the user is premium, send them an email
                if (user && user.premium) {
                    emailService.sendEmail(user.email, 'Product deleted', `The product ${product.title} has been deleted from your cart`);
                }
            }
        }
    } catch (error) {
        logger.error(`DELETE /api/products/:pid - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

export { router as productsRouter };
