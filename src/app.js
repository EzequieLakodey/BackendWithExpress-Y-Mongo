// Express
import express from 'express';
import handlebars from 'express-handlebars';

// Routers
import { productsRouter } from './routes/productsRoutes.js';
import { cartRouter } from './routes/cartRoutes.js';
import viewsRouter from './routes/views.router.js';

// Utils
import __dirname from './utils.js';

// Servers
import { io, app, httpServer } from './servers.js';

/* MODULES */

const port = 8080;
app.use(express.json());

app.use('/products', productsRouter);
app.use('/carts', cartRouter);

const hbs = handlebars.create({ defaultLayout: null });
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

httpServer.listen(port, () => {
    console.log(`server running on port ${port}`);
});
