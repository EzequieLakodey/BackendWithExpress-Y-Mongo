import mongoose from 'mongoose';
import { messagesCollection } from '../../constants/index.js';

const chatSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

export const chatModel = mongoose.model(messagesCollection, chatSchema);
