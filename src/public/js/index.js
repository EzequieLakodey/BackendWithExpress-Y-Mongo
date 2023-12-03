const socket = io('http://localhost:8080');

socket.on('newProduct', (product) => {
    'new product: ', product;
});
