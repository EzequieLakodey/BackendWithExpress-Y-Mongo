import { chatModel } from '../../models/chat.model.js';

class ChatManagerMongo {
    constructor() {
        this.model = chatModel;
    }

    async addMessage(user, message) {
        console.log('Adding message:', user, message);

        const newMessage = new this.model({ user, message });

        try {
            const savedMessage = await newMessage.save();
            console.log('Message saved successfully:', savedMessage);
            return savedMessage;
        } catch (error) {
            console.log('Error while saving the message:', error);
            throw new Error('Error while saving the message');
        }
    }

    async getMessages() {
        return this.model.find();
    }
}

export default ChatManagerMongo;
