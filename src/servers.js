import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { chatModel } from './dao/models/chat.model.js';
import { __dirname } from './utils.js';
import path from 'path';
import { connectDB } from './config/dbConnection.js';

/* MODULES */

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
    ('client connected');

    socket.on('realtimeproducts', async (msg) => {
        const messages = await chatModel.find();
        socket.emit('messagesHistory', messages);
        socket.emit('productsData', products);
        socket.broadcast.emit('newUser', msg);
    });

    socket.on('message', async (data) => {
        'data', data;
        const newMessage = new chatModel({
            user: data.user,
            message: data.message,
        });
        try {
            const messageCreated = await newMessage.save();
            'messageCreated', messageCreated;
        } catch (error) {
            'Error while saving the message:', error;
        }
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
        ('realtimeproducts event received');
    });

    socket.on('disconnect', () => {
        ('client disconnected');
    });
});

export { app, httpServer, io };
