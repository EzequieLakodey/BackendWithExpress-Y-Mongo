import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { collection: 'messages' }
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
