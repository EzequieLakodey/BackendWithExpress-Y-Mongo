import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { chatModel } from './dao/models/chat.model';

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

    socket.on('realtimeproducts', async (msg) => {
        const messages = await chatModel.find();
        socket.emit('messagesHistory', messages);
        socket.emit('productsData', products);
        socket.broadcast.emit('newUser', msg);
    });

    socket.on('message', async (data) => {
        console.log('data', data);
        const messageCreated = await chatModel.create(data);
        const messages = await chatModel.find();
        io.emit('messageHistory', messages);
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
