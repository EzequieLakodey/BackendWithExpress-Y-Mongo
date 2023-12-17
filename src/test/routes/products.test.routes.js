import { Router } from 'express';
import { logger } from '../../middlewares/logger.js';
import { productsManager } from '../../dao/controllers/mongo/products.mongo.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        logger.info('POST /api/products-test/ - posting product');
        const product = req.body;
        const newProduct = await productsManager.addProduct(product);
        res.json(newProduct);
    } catch (error) {
        logger.error(`POST /api/products-test/ - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        logger.info('GET /api/products-test/ - fetching all products');
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const products = await productsManager.getProducts({
            page: page,
            limit: size,
        });
        res.json(products);
    } catch (error) {
        logger.error(`GET /api/products-test/ - ${error.message}`);
        res.status(500).send('There was an error getting the products');
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        logger.info(`GET /api/products-test/:pid - fetching product ${pid}`);
        const product = await productsManager.getProductsById(pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        logger.error(`GET /api/products-test/:pid - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        logger.info(`PUT /api/products-test/:pid - updating product ${pid}`);
        const updatedProduct = await productsManager.updateProduct(
            pid,
            req.body
        );
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        logger.error(`PUT /api/products-test/:pid - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        logger.info(`DELETE /api/products-test/:pid - deleting product ${pid}`);
        const deletedProductId = await productsManager.deleteProduct(pid);
        if (deletedProductId) {
            res.json({
                message: `Product ${deletedProductId} deleted successfully`,
            });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        logger.error(`DELETE /api/products-test/:pid - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

export { router as productsTestRouter };
