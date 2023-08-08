import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import Chat from './dao/models/chat.model.js';
import { __dirname } from './utils.js';
import path from 'path';

// Import the `connectDB` function from `dbConnection.js`
import { connectDB } from './config/dbConnection.js';

let products = [];

const app = express();

// Configure static file serving
app.use(express.static(path.join(__dirname, 'public')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

// Connect to MongoDB by calling the `connectDB` function
connectDB();

io.on('connection', (socket) => {
    console.log('client connected');

    socket.on('realtimeproducts', async (msg) => {
        const messages = await Chat.find();
        socket.emit('messagesHistory', messages);
        socket.emit('productsData', products);
        socket.broadcast.emit('newUser', msg);
    });

    socket.on('message', async (data) => {
        console.log('data', data);
        const messageCreated = await Chat.create(data);
        const messages = await Chat.find();
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
