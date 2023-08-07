import mongoose from 'mongoose';

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

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
