import express from 'express';
import handlebars from 'express-handlebars';
import { config } from './config/config.js';
import { __dirname } from './utils.js';
import path from 'path';
import { app, httpServer } from './servers.js';
import { connectDB } from './config/dbConnection.js';
import { sessionsRouter } from './routes/sessions.routes.js';
import { viewsRouter } from './routes/views.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { cartsRouter } from './routes/carts.routes.js';
import { chatRouter } from './routes/chats.routes.js';
import passport from 'passport';
import { initializePassport } from './config/passportConfig.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { loggerTestRoute } from './routes/loggerTest.js';
import { logger } from './middlewares/logger.js';
import { swaggerSpecs } from './config/swagger.js';
import swaggerUI from 'swagger-ui-express';
import { productsTestRouter } from './test/routes/products.test.routes.js';
import { cartsTestRouter } from './test/routes/carts.test.routes.js';
import fs from 'fs';

/* MODULES */

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

const port = config.server.port;

httpServer.listen(port, () => {
    `server running on port ${port}`;
});

connectDB();

const hbs = handlebars.create({
    defaultLayout: null,
    extname: '.hbs',
    helpers: {
        eq: function (v1, v2) {
            return v1 === v2;
        },
        multiply: function (v1, v2) {
            return v1 * v2;
        },
        totalCost: function (products) {
            let total = 0;
            for (let product of products) {
                total += product.quantity * product.product.price;
            }
            return total;
        },
    },
});
hbs.handlebars.registerPartial('navbar', fs.readFileSync(path.join(__dirname, 'views', 'partials', 'navbar.hbs'), 'utf8'));

hbs.handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));

initializePassport();
app.use(passport.initialize());
app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).send('An error occurred');
});

app.use(express.static(__dirname + '/public'));
app.use(viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/chats', chatRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/loggerTest', loggerTestRoute);
app.use('/api/products-test', productsTestRouter);
app.use('/api/carts-test', cartsTestRouter);

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

export default app;
