import { verifyToken } from '../middlewares/auth.js';
import { Router } from 'express';
import { logger } from '../middlewares/logger.js';
import ProductsManager from '../dao/controllers/fs/productsManager.js';
import ProductsManagerMongo from '../dao/controllers/mongo/products.mongo.js';

const router = Router();
const mongoManager = new ProductsManagerMongo();

router.get('/', verifyToken, async (req, res) => {
    try {
        logger.info('GET /api/test/products - fetching all products');
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const products = await mongoManager.getProducts({
            page: page,
            limit: size,
        });
        res.json(products);
    } catch (error) {
        logger.error(`GET /api/test/products - ${error.message}`);
        res.status(500).send('There was an error getting the products');
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        logger.info(`GET /api/test/products/:pid - fetching product ${pid}`);
        const product = await mongoManager.getProductsById(pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        logger.error(`GET /api/test/products/:pid - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

export { router as productsTestRouter };
