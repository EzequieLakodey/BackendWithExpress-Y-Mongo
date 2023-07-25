const socket = io('http://localhost:8080');

socket.on('newProduct', (product) => {
    console.log('new product: ', product);
});
