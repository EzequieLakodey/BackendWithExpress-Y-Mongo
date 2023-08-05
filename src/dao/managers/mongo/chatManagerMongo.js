import mongoose from 'mongoose';

import { chatModel } from '../../models/chat.model.js';

class ChatManagerMongo {
    constructor() {
        this.model = Chat;
    }

    async addMessage(user, message) {
        const newMessage = new this.model({ user, message });
        let savedMessage;
        try {
            savedMessage = await newMessage.save();
        } catch (error) {
            console.log('Error while saving the message:', error);
            throw new Error('Error while saving the message');
        }
        return savedMessage;
    }

    async getMessages() {
        return this.model.find();
    }
}

export default ChatManagerMongo;
