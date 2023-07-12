import express from 'express';
import { productsRouter } from './routes/productsRoutes.js';
import { cartRouter } from './routes/cartRoutes.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

app.use(express.json());

// launching server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// routes
app.use('/products', productsRouter);
app.use('/carts', cartRouter);
