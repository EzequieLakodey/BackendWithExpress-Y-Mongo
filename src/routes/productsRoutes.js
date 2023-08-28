import ProductsManager from '../dao/managers/fileSystem/productsManager.js';
import ProductsMongo from '../dao/managers/mongo/productsManagerMongo.js';
import { Router } from 'express';
import { io } from '../servers.js';

const router = Router();
const mongoManager = new ProductsMongo();
const fileManager = new ProductsManager('products.json');
router.get('/', async (req, res) => {
    try {
        let { limit, page, sort, query } = req.query;

        if (query) {
            try {
                query = JSON.parse(decodeURIComponent(query));
            } catch (error) {
                console.log('Error parsing query parameter: ', error);
            }
        }

        const products = await mongoManager.getProducts({
            limit,
            page,
            sort,
            query,
        });
        res.render('products', { products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await mongoManager.getProductsById(pid);
        if (product) {
            res.render('productsDetails', { product: product.toObject() });
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
        const newProductFile = await fileManager.addProduct(product);
        const newProductMongo = await mongoManager.addProduct(product);
        io.emit('new-product', newProductFile);
        res.json({
            fileSystemProduct: newProductFile,
            mongoDBProduct: newProductMongo,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await fileManager.updateProduct(pid, req.body);
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
        const deletedProductId = await fileManager.deleteProduct(pid);
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
