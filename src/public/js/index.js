const socket = io('http://localhost:0000');

socket.on('newProduct', (product) => {
    'new product: ', product;
});
