// Express
import express from 'express';

// Hbs
import handlebars from 'express-handlebars';

// Routers
import { productsRouter } from './routes/productsRoutes.js';
import { cartRouter } from './routes/cartRoutes.js';
import viewsRouter from './routes/views.router.js';

// Config
import { config } from './config/config.js';

// Utils
import { __dirname } from './utils.js';

// Path
import path from 'path';

// Servers
import { app, httpServer } from './servers.js';

// Mongo Db
import { connectDB } from './config/dbConnection.js';

// MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

/* MODULES */

const port = config.server.port;

httpServer.listen(port, () => {
    console.log(`server running on port ${port}`);
});

connectDB();

const hbs = handlebars.create({ defaultLayout: null });
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

app.use(viewsRouter);
app.use('/products', productsRouter);
app.use('/carts', cartRouter);
