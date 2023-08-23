import express from 'express';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { productsRouter } from './routes/productsRoutes.js';
import { cartRouter } from './routes/cartsRoutes.js';
import { config } from './config/config.js';
import { __dirname } from './utils.js';
import path from 'path';
import { app, httpServer } from './servers.js';
import { connectDB } from './config/dbConnection.js';
/* MODULES */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

const port = config.server.port;

httpServer.listen(port, () => {
    console.log(`server running on port ${port}`);
});

connectDB();

const hbs = handlebars.create({ defaultLayout: null, extname: '.hbs' });
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
