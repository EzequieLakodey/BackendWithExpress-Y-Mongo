import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

let products = [];

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    console.log('client connected');

    socket.on('realtimeproducts', () => {
        console.log('realtimeproducts event received');
        socket.emit('productsData', products);
    });

    socket.on('newProduct', (product) => {
        products.push(product);
        io.emit('productAdded', product);
    });

    socket.on('deleteProduct', (productId) => {
        products = products.filter((product) => product.id !== productId);
        io.emit('productDeleted', productId);
    });

    socket.on('realtimeproducts', () => {
        console.log('realtimeproducts event received');
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});

export { app, httpServer, io };
