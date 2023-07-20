const socket = io('http://localhost:8080');

socket.on('new-product', (product) => {
    console.log('new product: ', product);
});
