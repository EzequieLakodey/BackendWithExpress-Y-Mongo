import socket from './socketConnection.js';

window.addEventListener('load', () => {
    socket.connectSocket();

    socket.on('productAdded', (product) => {
        const liTitle = document.createElement('li');
        liTitle.dataset.id = product.id;
        const divTitle = document.createElement('div');
        divTitle.innerHTML = `<h2>${product.title}</h2>`;
        liTitle.appendChild(divTitle);

        const liPrice = document.createElement('li');
        liPrice.dataset.id = product.id;
        const divPrice = document.createElement('div');
        divPrice.innerHTML = `<strong>$${product.price}</strong>`;
        liPrice.appendChild(divPrice);

        const liThumbnail = document.createElement('li');
        liThumbnail.dataset.id = product.id;
        const divThumbnail = document.createElement('div');
        divThumbnail.innerHTML = `<img src="${product.thumbnail}" alt="Product thumbnail" />`;
        liThumbnail.appendChild(divThumbnail);

        const productList = document.querySelector('article ul');
        productList.appendChild(liTitle);
        productList.appendChild(liPrice);
        productList.appendChild(liThumbnail);
    });

    socket.on('productDeleted', (id) => {
        const productList = document.querySelector('article ul');
        Array.from(productList.children).forEach((li) => {
            if (li.dataset.id === id) {
                productList.removeChild(li);
            }
        });
    });
});
window.addEventListener('beforeunload', () => {
    socket.disconnectSocket();
});
