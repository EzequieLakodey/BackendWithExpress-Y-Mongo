import express from 'express';
import { productsRouter } from './routes/productsRoutes.js';
import { cartRouter } from './routes/cartRoutes.js';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';

const app = express();
const port = 8080;

app.use(express.json());

// routes
app.use('/products', productsRouter);
app.use('/carts', cartRouter);

// launching server
const httpServer = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const socketServer = new Server(httpServer);
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + './views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + './public'));
app.use('/', viewsRouter);
