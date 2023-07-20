import ProductsManager from '../productsManager.js';
import { Router } from 'express';
import { io } from '../servers.js';

const router = Router();
const manager = new ProductsManager('products.json');
router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await manager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await manager.getProductsById(pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await manager.addProduct(product);
        io.emit('new-product', newProduct);
        res.json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await manager.updateProduct(pid, req.body);
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProductId = await manager.deleteProduct(pid);
        if (deletedProductId) {
            io.emit('delete-product', deletedProductId);
            res.json({
                message: `Product ${deletedProductId} deleted successfully`,
            });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export { router as productsRouter };
