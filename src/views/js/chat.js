import { io } from 'socket.io-client';
const socket = io(); // Initialize socket.io

// Configure socket.io connection
socket.on('connect', () => {
    console.log('Connected to server');
});

const updateChat = (messages) => {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    messages.forEach((message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        const userElement = document.createElement('span');
        userElement.classList.add('user');
        userElement.innerText = message.user;

        const contentElement = document.createElement('span');
        contentElement.classList.add('content');
        contentElement.innerText = message.message;

        messageElement.appendChild(userElement);
        messageElement.appendChild(contentElement);

        chatMessages.appendChild(messageElement);
    });
};

document.getElementById('chat-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const user = document.getElementById('user-input').value;
    const message = document.getElementById('message-input').value;

    socket.emit('message', { user, message });

    document.getElementById('message-input').value = '';
});
