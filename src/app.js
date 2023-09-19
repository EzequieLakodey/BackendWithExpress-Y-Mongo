import express from 'express';
import handlebars from 'express-handlebars';
import { config } from './config/config.js';
import { __dirname } from './utils.js';
import path from 'path';
import { app, httpServer } from './servers.js';
import { connectDB } from './config/dbConnection.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { sessionsRouter } from './routes/sessions.routes.js';
import { viewsRouter } from './routes/views.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { cartsRouter } from './routes/carts.routes.js';
import passport from 'passport';
import { initializePassport } from './config/passportConfig.js';
import cookieParser from 'cookie-parser';
/* MODULES */

app.use(cookieParser());
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

app.use(
    session({
        store: MongoStore.create({
            mongoUrl: `${config.mongo.url}/ecommerce`,
        }),
        secret: config.server.secretSession,
        resave: true,
        saveUninitialized: true,
    })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));
app.use(viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use('/api/sessions', sessionsRouter);
