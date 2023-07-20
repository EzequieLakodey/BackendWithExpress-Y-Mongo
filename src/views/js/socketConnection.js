let socket;

const connectSocket = () => {
    socket = io();

    socket.on('connect', () => {
        if (window.location.pathname === '/realTimeProducts') {
            socket.emit('realtimeproducts');

            window.addEventListener('beforeunload', () => {
                socket.disconnect();
            });
        }
    });
};

const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

export default { connectSocket, disconnectSocket };
